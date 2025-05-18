import express from "express";
import path from "path";
import fs from "fs";
import { Driver, Team, User } from "./interfaces";
import driver from "./driver.json";
import team from "./team.json";
import {connectDb,initializeData,getDrivers,getTeams,getDriverById,getTeamById,getDriversByTeamId,updateDriver,updateTeam,login} from "./database";
import dotenv from "dotenv";
import session from "./session";
import { secureMiddleware } from "./secureMiddleware";

dotenv.config();

const app = express();

app.set("port", 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session);

console.log(process.env.PORT);
console.log(process.env.MONGO_URI)
app.set("port", process.env.PORT || 3000);

// Helper function to find local images (optioneel, blijft hetzelfde)
function getLocalImagePath(basePath: string): string | null {
  const extensions = [".jpg", ".png", ".jpeg", ".webp"];
  for (const ext of extensions) {
    const imagePath = path.join(__dirname, "public", "images", `${basePath}${ext}`);
    if (fs.existsSync(imagePath)) {
      return `/images/${basePath}${ext}`;
    }
  }
  return null;
}

async function startServer() {
  // 1. Maak connectie met database en initialiseer data als nodig
  await connectDb();
  await initializeData(driver, team);

  // 2. Routes
  
  // Login route
  app.get("/login", (req, res) => {
    res.render("login");
  });

// Home route
app.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const drivers = await getDrivers();
  const teams = await getTeams();

  res.render("index", {
    drivers,
    teams,
    user: req.session.user
  });
});


  // Drivers route
  app.get("/drivers", async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";

    // MongoDB filter en sort objecten bouwen
    const filter = q ? { name: { $regex: `^${q}`, $options: "i" } } : {};
    const sort: any = {};
    sort[sortField] = sortDirection === "asc" ? 1 : -1;

    let drivers = await getDrivers(filter, sort);

    res.render("drivers", {
      drivers,
      teams: await getTeams(),
      q,
      sortField,
      sortDirection,
    });
  });

  // Teams route
  app.get("/teams", async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";

    const filter = q ? { name: { $regex: `^${q}`, $options: "i" } } : {};
    const sort: any = {};
    sort[sortField] = sortDirection === "asc" ? 1 : -1;

    const teams = await getTeams(filter, sort);

    res.render("teams", {
      teams,
      drivers: await getDrivers(),
      q,
      sortField,
      sortDirection,
    });
  });

  // Driver detail
  app.get("/driver/:id", async (req, res) => {
    const driverId = req.params.id;
    const driver = await getDriverById(driverId);

    if (!driver) {
      return res.status(404).render("error", { message: "Driver not found" });
    }

    res.render("driver-detail", {
      driver,
      teams: await getTeams(),
    });
  });
  // Edit formulier tonen driver
  app.get('/driver/:id/edit', async (req, res) => {
  const driverId = req.params.id;
  const driver = await getDriverById(driverId);
  if (!driver) {
    return res.status(404).render('error', { message: 'Driver not found' });
  }
  res.render('driver-edit', { driver });
});

// Verwerking van de edit (POST)
app.post('/driver/:id/edit', async (req, res) => {
  const driverId = req.params.id;
  const updatedData = {
    name: req.body.name,
    nationality: req.body.nationality,
    driverNumber: Number(req.body.driverNumber),
    raceWins: Number(req.body.raceWins),
    isActive: req.body.isActive === "on",  // checkbox verwerking
    // Voeg hier andere velden toe die je wilt aanpassen
  };

  try {
    await updateDriver(driverId, updatedData);
    res.redirect(`/driver/${driverId}`);  // Na updaten terug naar detailpagina
    } catch (error) {
    res.status(500).render('error', { message: 'Failed to update driver' });
    }
    });

  // Team detail
  app.get("/team/:id", async (req, res) => {
    const teamId = req.params.id;
    const team = await getTeamById(teamId);
    const teamDrivers = await getDriversByTeamId(teamId);

    if (!team) {
      return res.status(404).render("error", { message: "Team not found" });
    }

    res.render("team-detail", {
      team,
      drivers: teamDrivers,
      allDrivers: await getDrivers(),
    });
  });
  // Edit formulier tonen voor een team
    app.get('/team/:id/edit', async (req, res) => {
        const teamId = req.params.id;
        const team = await getTeamById(teamId);

        if (!team) {
            return res.status(404).render('error', { message: 'Team not found' });
        }

        res.render('team-edit', { team });
    });

    // Verwerking van het editformulier (POST)
    app.post('/team/:id/edit', async (req, res) => {
        const teamId = req.params.id;

        const updatedTeam = {
            name: req.body.name,
            amountOfChampionships: Number(req.body.amountOfChampionships),
            amountOfWins: Number(req.body.amountOfWins)
            // Voeg extra velden toe als nodig
        };

        try {
            await updateTeam(teamId, updatedTeam);
            res.redirect(`/team/${teamId}`);
        } catch (error) {
            res.status(500).render('error', { message: 'Failed to update team' });
        }
    });


  // Server starten
  app.listen(app.get("port"), () => {
    console.log(`[server] http://localhost:${app.get("port")}`);
  });
}

startServer();
