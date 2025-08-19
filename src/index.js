import { displayDropDown,otherClick } from "./showDropDown";
import "./styles.css";
console.log("Hi");
window.displayDropDown = displayDropDown;
window.otherClick = otherClick;
window.addEventListener("click",otherClick);
