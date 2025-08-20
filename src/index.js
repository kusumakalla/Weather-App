import "./styles.css";
import map from "./assets/images/map-marker.svg";
import humid from "./assets/images/humidity-svgrepo-com.svg";
import dewimg from "./assets/images/dew-svgrepo-com.svg";
import windimg from "./assets/images/wind-svgrepo-com.svg";

const inputLocation = document.querySelector("#location");
const enterButton = document.querySelector(".locationButton");
const form = document.querySelector("form");
const infoDiv = document.querySelector(".infoDiv");
const errorMsg = document.querySelector(".errorMsg");

const currentDate = new Date();
const currentDateString = currentDate.toLocaleDateString();
const currentTimeString = currentDate.toLocaleTimeString();
console.log(currentDateString, currentTimeString);

form.addEventListener("submit",(e)=>{
    handleSubmit(e);
})

async function handleSubmit(e) {
    e.preventDefault();
    try{
    const {condition, temp, feelslike, icon, humidity, dew, windspeed,resolvedAddress,days} = await getWeather(inputLocation.value);
    if(errorMsg.classList.contains("show")){
        errorMsg.classList.remove("show");
        errorMsg.classList.add("hide");
    }
    if(infoDiv.classList.contains("hide")){
        infoDiv.classList.remove("hide");
    }
    showInfo(condition, temp, feelslike, icon, humidity, dew, windspeed,resolvedAddress,days)
    infoDiv.classList.add("show");
    } catch(error){
        if(infoDiv.classList.contains("show")){
            infoDiv.classList.remove("show");
            infoDiv.classList.add("hide");
        }
        if(errorMsg.classList.contains("hide")){
            errorMsg.classList.remove("hide");
        }
        errorMsg.textContent="";
        errorMsg.classList.add("show");
        const errorText = document.createElement("p");
        errorText.textContent = error.message;
        errorMsg.appendChild(errorText);
        console.log(`oops error : ${error.message}`);
    }
    form.reset();
}

function showInfo(condition, temp, feelslike, icon, humidity, dew, windspeed,resolvedAddress,days){
    infoDiv.textContent="";
    const addresDateDiv = document.createElement("div");
    addresDateDiv.classList.add("addresDateDiv");
    const addres = document.createElement("div");
    addres.classList.add("addres");
    const locIcon = document.createElement("object");
    locIcon.classList.add("icon");
    locIcon.data = map;
    locIcon.type = "image/svg+xml";
    addres.appendChild(locIcon);
    let infoh2 = document.createElement("h2");
    infoh2.textContent = resolvedAddress;
    addres.appendChild(infoh2);
    addresDateDiv.appendChild(addres);
    let dateP = document.createElement("p");
    dateP.textContent = currentDateString;
    addresDateDiv.appendChild(dateP);
    
    
    infoDiv.appendChild(addresDateDiv);

    const currentDay = document.createElement("div");
    currentDay.classList.add("currentDay");
    const conditionDiv = document.createElement("div");
    conditionDiv.classList.add("conditionDiv");
    const conditionImage = document.createElement("img");
    async function loadIcon(icon){
        const imgSrc = await import(`./assets/images/${icon}.svg`);
        conditionImage.src= imgSrc.default;
    }
    loadIcon(icon);
    conditionDiv.appendChild(conditionImage);
    let line1 = document.createTextNode("p");
    line1.textContent = condition;
    conditionDiv.appendChild(line1);
    conditionDiv.appendChild(document.createElement('br'));
    let line2 = document.createTextNode(`Temp :${temp} F`);
    conditionDiv.appendChild(line2);
    conditionDiv.appendChild(document.createElement('br'));
    let line3 = document.createTextNode(`Feels like ${feelslike} F`);
    conditionDiv.appendChild(line3);
    currentDay.appendChild(conditionDiv);

    const otherValues = document.createElement("div");
    otherValues.classList.add("otherValues");
    const humidDiv = document.createElement("div");
    humidDiv.classList.add("otherDiv");
    const humidImg = document.createElement("img");
    humidImg.src = humid;
    humidDiv.appendChild(humidImg);
    let value1 = document.createTextNode("p");
    value1.textContent= `Humidity : ${humidity} %`;
    humidDiv.appendChild(value1);
    otherValues.appendChild(humidDiv);
    const dewDiv = document.createElement("div");
    dewDiv.classList.add("otherDiv");
    const dewImg = document.createElement("img");
    dewImg.src = dewimg;
    dewDiv.appendChild(dewImg);
    let value2 = document.createTextNode("p");
    value2.textContent= `Dew : ${dew}`;
    dewDiv.appendChild(value2);
    otherValues.appendChild(dewDiv);
    const windDiv = document.createElement("div");
    windDiv.classList.add("otherDiv");
    const windImg = document.createElement("img");
    windImg.src = windimg;
    windDiv.appendChild(windImg);
    let value3 = document.createTextNode("p");
    value3.textContent= `WindSpeed : ${windspeed} mph`;
    windDiv.appendChild(value3);
    otherValues.appendChild(windDiv);
    currentDay.appendChild(otherValues);

    infoDiv.appendChild(currentDay);

    const forcastDiv = document.createElement("div");
    forcastDiv.classList.add("forcastDiv");
    const forecastHeader = document.createElement("h3");
    forecastHeader.textContent = "Forecast for the next 5 days";
    forcastDiv.appendChild(forecastHeader);

    const forecastCards = document.createElement("div");
    forecastCards.classList.add("forecastCards")
    for(let i=1;i<6;i++){
        const newDay = document.createElement("div");
        newDay.classList.add("newDay");
        const day = document.createElement("h4");
        let localeDate = new Date(days[i].datetime);
        let dayName = localeDate.toLocaleDateString("en-US", { weekday: "short" });
        day.textContent = dayName;
        newDay.appendChild(day);
        const dayImg = document.createElement("img");
        dayImg.classList.add("dayImg");
        async function loadImg(icon){
            const imgSrc = await import(`./assets/images/${icon}.svg`);
            dayImg.src= imgSrc.default;
        }
        loadImg(days[i].icon);
        newDay.appendChild(dayImg);
        const dayCond = document.createElement("p");
        dayCond.textContent = days[i].conditions;
        newDay.appendChild(dayCond);
        const dayTemp = document.createElement("p");
        dayTemp.textContent = days[i].temp + " F"
        newDay.appendChild(dayTemp);
        forecastCards.appendChild(newDay);
    }
    forcastDiv.appendChild(forecastCards);
    infoDiv.appendChild(forcastDiv);
}


async function getWeather(location){
    let url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "?unitGroup=us&key=2Q2VVKA8LL3JFCFJFNDH9J2Q8&contentType=json"
    
    let data = await fetch(url , {mode : 'cors'});
    if(!data.ok)
        throw new Error(`Error : ${data.status} . Please enter a valid city`);
    let dataJson = await data.json();
    const condition = dataJson.currentConditions.conditions;
    const temp = dataJson.currentConditions.temp;
    const feelslike = dataJson.currentConditions.feelslike;
    const icon = dataJson.currentConditions.icon;
    const humidity = dataJson.currentConditions.humidity;
    const dew = dataJson.currentConditions.dew;
    const windspeed = dataJson.currentConditions.windspeed;
    const resolvedAddress = dataJson.resolvedAddress;
    const days = dataJson.days;
    return {condition, temp, feelslike, icon, humidity, dew, windspeed,resolvedAddress,days};
    
}



// getWeather("bangalore");