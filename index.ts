import * as readline from 'readline-sync';
import {Driver, Team} from "./interfaces"
import driver from "./driver.json";
import team from "./team.json";

const drivers: Driver[] = driver;
const teams: Team[] = team;

console.log("Welcome to the the JSON data viewer!")
console.log()
let choices : string[] = ["View all data", "Filter by ID","Exit"]
console.log()
let userChoice : number = readline.keyInSelect(choices, "Please enter you choice: ")

switch(userChoice){
    case 1:
        // code that shows all drivers and their data
        break;
    case 2:
        // code that filters drivers by given ID by user
        break;
    case 3:
        // code that exits the application
        break;
    default:
        console.log(`${userChoice} is not a possible choice. Please try again.`);
}