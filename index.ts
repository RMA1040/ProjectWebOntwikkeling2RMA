import express from "express";
import {Driver, Team} from "./interfaces"
import driver from "./driver.json";
import team from "./team.json";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

//-------------------------------------------------------------DRIVER ROUTES

const drivers: Driver[] = driver;
const teams: Team[] = team;

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/drivers",(req,res)=>{
    res.render("drivers");
});

app.get("/teams",(req,res)=>{
    res.render("teams");
});

app.listen(app.get("port"), ()=>console.log( "[server] http://localhost:" + app.get("port")));
