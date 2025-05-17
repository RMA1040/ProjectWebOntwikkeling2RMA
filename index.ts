import express from "express";
import { Driver, Team } from "./interfaces";
import driver from "./driver.json";
import team from "./team.json";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("port", 3000);

const drivers: Driver[] = driver;
const teams: Team[] = team;

// Helper function to find local images
function getLocalImagePath(basePath: string): string | null {
    const extensions = ['.jpg', '.png', '.jpeg', '.webp'];
    for (const ext of extensions) {
        const imagePath = path.join(__dirname, 'public', 'images', `${basePath}${ext}`);
        if (fs.existsSync(imagePath)) {
            return `/images/${basePath}${ext}`;
        }
    }
    return null;
}

// Driver route
app.get("/drivers", (req, res) => {
    // searching
    const q = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
    let filteredDrivers = drivers.filter((driver) => {
        return driver.name.toLowerCase().startsWith(q);
    });
    // sorting
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
     let sortedDrivers = filteredDrivers.sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === "driverNumber") {
            return sortDirection === "asc" ? a.driverNumber - b.driverNumber : b.driverNumber - a.driverNumber;
        } else if (sortField === "nationality") {
            return sortDirection === "asc" ? a.nationality.localeCompare(b.nationality) : b.nationality.localeCompare(a.nationality);
        } else {
            return 0;
        }
    });
    res.render("drivers", {
        drivers: sortedDrivers,
        teams: teams,
        q: q,
        sortField: sortField,
        sortDirection: sortDirection
    });
});

// Home route
app.get("/", (req, res) => {
    res.render("index", {
        drivers: drivers,
        teams: teams
    });
});

// Teams route
app.get("/teams", (req, res) => {
    // searching
    let q : string = typeof req.query.q === "string" ? req.query.q : "";
    let filteredTeams = teams.filter((team) => {
        return team.name.toLowerCase().startsWith(q);
    });
    // sorting
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
        let sortedTeams = filteredTeams.sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === "amountOfChampionships") {
            return sortDirection === "asc" ? a.amountOfChampionships - b.amountOfChampionships : b.amountOfChampionships - a.amountOfChampionships;
        } else if (sortField ==="amountOfWins") {
            return sortDirection === "asc" ? a.amountOfWins - b.amountOfWins : b.amountOfWins - a.amountOfWins;
        }
        else {
            return 0;
        }
    });
    res.render("teams", {
        teams: sortedTeams,
        drivers : drivers,
        q: q,
        sortField: sortField,
        sortDirection: sortDirection
    });
});

// driver detail route
app.get('/driver/:id', (req, res) => {
    const driverId = req.params.id;
    const driver = drivers.find(d => d.id === driverId);
    
    if (!driver) {
        return res.status(404).render('error', { 
            message: 'Driver not found' 
        });
    }

    res.render('driver-detail', { 
        driver: driver,
        teams: teams 
    });
});

// Route for team details
app.get('/team/:id', (req, res) => {
    const teamId = req.params.id;
    const team = teams.find(t => t.id === teamId);
    const teamDrivers = drivers.filter(d => d.currentTeam.id === teamId);
    
    if (!team) {
        return res.status(404).render('error', { 
            message: 'Team not found' 
        });
    }

    res.render('team-detail', { 
        team: team,
        drivers: teamDrivers,
        allDrivers: drivers
    });
});

app.listen(app.get("port"), () => {
    console.log(`[server] http://localhost:${app.get("port")}`);
});