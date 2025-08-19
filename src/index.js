const inputLocation = document.querySelector("#location");
const enterButton = document.querySelector(".locationButton");
const form = document.querySelector("form");


form.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log(inputLocation.value);
    getWeather(inputLocation.value);
    
})

async function getWeather(location){
    let url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "?unitGroup=us&key=2Q2VVKA8LL3JFCFJFNDH9J2Q8&contentType=json"
    try{
        let data = await fetch(url , {mode : 'cors'});
        if(!data.ok)
            throw new Error(`Error : ${data.status} . Please enter a valid city`);
        let dataJson = await data.json();
        console.log(dataJson);
        console.log(dataJson.currentConditions.conditions);
    } catch(error){
        console.log(`oops error : ${error.message}`);
    }
}



// getWeather("bangalore");