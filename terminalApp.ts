import * as readline from 'readline-sync';
import {Driver, Team} from "./interfaces"
import driver from "./driver.json";
import team from "./team.json";

const drivers: Driver[] = driver;
const teams: Team[] = team;
let userChoice : number;

function ShowDriver(driver:Driver){
    console.log(`🚗  ${driver.name}  (#${driver.driverNumber})`);
    console.log(`   📌 ID: ${driver.id}`);
    console.log(`   🌍 Nationality: ${driver.nationality}`);
    console.log(`   🏎️ Teams: ${driver.teams.join(", ")}`);
    console.log(`   🎂 Birthdate: ${driver.birthdate}`);
    console.log(`   🏁 First Race: ${driver.firstRace}`);
    console.log(`   🏆 Active: ${driver.isActive ? "✅ Yes" : "❌ No"}`);
    console.log(`   ⭐ Current Team: ${driver.currentTeam.name}`);
    console.log(`   -  ID: ${driver.currentTeam.id}`);
    console.log(`   -  Description: ${driver.currentTeam.description}`);
    console.log(`   -  Exist since: ${driver.currentTeam.dateOfExistence}`);
    console.log(`   -  Championships: ${driver.currentTeam.amountOfChampionships}`);
    console.log(`   -  Wins: ${driver.currentTeam.amountOfWins}`);
    console.log("---------------------------------------------------");
};

while(true){
    console.log("Welcome to the the JSON data viewer!")
    console.log();
    let choices : string[] = ["View all data", "Filter by ID","Exit"];
    console.log();
    userChoice = readline.keyInSelect(choices, "Please enter your choice: ");
    console.clear();
    switch(userChoice){
        case 0:
            // code that shows all drivers and their data
            console.log("===ALL DATA===");
            drivers.forEach(driver => {
                ShowDriver(driver);
            });
            break;
        case 1:
            // code that filters drivers by given ID by user
            const idInput = readline.question("Enter driver ID: ").toUpperCase();
            const foundDriver = drivers.find(driver => driver.id == idInput);
            if(!foundDriver){
                console.log(`Sorry ${idInput} is not a valid ID. Please try again.`);
            }
            else{
                ShowDriver(foundDriver);
            }
            break;
        case 2:
            // code that exits the application
            console.log(`EXITING...`)
            process.exit(0);
            break;
        default:
            console.log(`${userChoice} is not a possible choice. Please try again.`);
    }
}