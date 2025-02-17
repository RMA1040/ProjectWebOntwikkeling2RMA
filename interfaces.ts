import { Interface } from "readline"

export interface Driver{
    id:string,
    name:string,
    description:string,
    age:number,
    driverNumber:number,
    nationality:string,
    isActive:boolean,
    birthdate:string, // of toch  "Date"?
    firstRace:string, // of toch  "Date"?
    teams:[string],
    currentTeam:Team
}

export interface Team{
    id:string,
    name:string,
    description:string,
    dateOfExistence:string, // of toch  "Date"?
    amountOfChampionships:number,
    amountOfWins:number
}