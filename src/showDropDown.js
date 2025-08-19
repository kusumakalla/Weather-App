
function displayDropDown(id){
    console.log(id);
    let dropDownOptions = document.getElementById(id); 
    dropDownOptions.classList.toggle("show");     
}
function otherClick(e){
        if(!e.target.closest(".dropDownOptions") && !e.target.closest(".clickButton")){
            let dropDownOptions = document.querySelectorAll(".dropDownOptions");
            
            for(let i of dropDownOptions){
                console.log(i);
            if(i.classList.contains("show")){
                i.classList.remove("show");
            }
        }
        }
    }

export {displayDropDown,otherClick}
