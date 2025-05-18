import { MONGO_URI } from "./database";
import session, { MemoryStore } from "express-session";
import {User} from "./interfaces";
import MongoDbSession from "connect-mongodb-session";
const mongoDBStore = MongoDbSession(session);

const mongoStore = new mongoDBStore({
    uri: MONGO_URI,
    collection: "sessions",
    databaseName: "irc",
});

declare module 'express-session' {
    export interface SessionData {
        user?: User
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});