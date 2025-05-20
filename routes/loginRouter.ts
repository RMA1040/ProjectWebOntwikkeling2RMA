import express from "express";
import {User} from "../interfaces";
import {login} from "../database";
import { secureMiddleware } from "../secureMiddleware";

export function loginRouter() {
    const router = express.Router();

    router.get("/login", async (req, res) => {
        if (req.session.user) {
        return res.redirect("/");  // Al ingelogd? Stuur door naar home
    }
        res.render("login");
    });

    router.post("/login", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            let user: User = await login(email, password);
            delete user.password; // Remove password from user object. Sounds like a good idea.
            req.session.user = user;
            res.redirect("/")
        } catch (e: any) {
            res.redirect("/login");
        }
    });

    router.post("/logout", secureMiddleware, async (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });
    });

    return router;
}