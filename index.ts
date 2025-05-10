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

// Modified route handler with image fallbacks
app.get("/drivers", (req, res) => {
    const enhancedDrivers = drivers.map(driver => {
        const driverImg = getLocalImagePath(`drivers/${driver.id}`);
        const teamImg = getLocalImagePath(`teams/${driver.currentTeam.id}`);
        
        return {
            ...driver,
            localImage: driverImg || '/images/default_driver.jpg',
            currentTeam: {
                ...driver.currentTeam,
                localImage: teamImg || '/images/default_team.png'
            }
        };
    });

    res.render("drivers", { drivers: enhancedDrivers });
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
    res.render("teams", {
        teams: teams,
        drivers: drivers
    });
});

app.listen(app.get("port"), () => {
    console.log(`[server] http://localhost:${app.get("port")}`);
});