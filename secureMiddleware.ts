import { NextFunction, Request, Response } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("User in session:", req.session.user);
    if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect("/login");
    }
};