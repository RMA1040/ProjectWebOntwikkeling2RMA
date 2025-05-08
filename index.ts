import express from "express";
import {Driver, Team} from "./interfaces";
import driver from "./driver.json";
import team from "./team.json";

const app = express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("port", 3000);

const drivers: Driver[] = driver;
const teams: Team[] = team;

// Home route - nu met data
app.get("/", (req, res) => {
    res.render("index", {
        drivers: drivers,
        teams: teams
    });
});

app.get("/drivers", (req, res) => {
    res.render("drivers", {
        drivers: drivers
    });
});

app.get("/teams", (req, res) => {
    res.render("teams", {
        teams: teams,
        drivers: drivers  // Nodig voor het tellen van actieve drivers per team
    });
});

app.listen(app.get("port"), () => {
    console.log("[server] http://localhost:" + app.get("port"));
});