import { Interface } from "readline"

interface Driver{
    id:string,
    name:string,
    description:string,
    age:number,
    driverNumber:number,
    nationality:string,
    isActive:boolean,
    birthdate:Date,
    firstRace:Date,
    teams:[string],
    currentTeam:{
        id:string,
        name:string,
        description:string,
        dateOfExistence:Date,
        amountOfChampionships:number,
        amountOfWins:number
    }
}

interface Team{
    id:string,
    name:string,
    description:string,
    dateOfExistence:Date,
    amountOfChampionships:number,
    amountOfWins:number
}