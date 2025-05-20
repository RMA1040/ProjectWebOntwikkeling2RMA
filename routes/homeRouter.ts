import express from "express";
import { getDrivers,getTeams } from "../database";
import { User } from "../interfaces";
import { secureMiddleware } from "../secureMiddleware";

export function homeRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async(req, res) => {
        const drivers = await getDrivers();
        const teams = await getTeams();
        
        res.render("index", {
            drivers,
            teams,
            user: req.session.user});
    });

    return router;
}