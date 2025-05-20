import { MongoClient, Db, Collection } from "mongodb";
import { Driver, Team } from "./interfaces";
import { User } from "./interfaces";
import bcrypt from "bcrypt";
import dotenv from "dotenv";


dotenv.config(); // laad variabelen uit .env
export const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

const DB_NAME = "irc";

let db: Db;
let driverCollection: Collection<Driver>;
let teamCollection: Collection<Team>;
let userCollection: Collection<User>;

// connectie maken met database
export async function connectDb() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    driverCollection = db.collection<Driver>("drivers");
    teamCollection = db.collection<Team>("teams");
    userCollection = db.collection<User>("users");
    console.log("✅ Connected to MongoDB");
};

//Data in Database steken
export async function initializeData(drivers: Driver[], teams: Team[]) {
    const driverCount = await driverCollection.countDocuments();
    if (driverCount === 0) {
        await driverCollection.insertMany(drivers);
        console.log("✅ Drivers inserted");
    };
    const teamCount = await teamCollection.countDocuments();
    if (teamCount === 0) {
        await teamCollection.insertMany(teams);
        console.log("✅ Teams inserted");
    };
    const userCount = await userCollection.countDocuments();
    if (userCount === 0) {
        const saltRounds = 10;

        // Admin user
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
        }
        const hashedAdminPassword = await bcrypt.hash(adminPassword, saltRounds);
        await userCollection.insertOne({
            email: adminEmail,
            password: hashedAdminPassword,
            role: "ADMIN"
        });

        // Normale user
        const userEmail = process.env.USER_EMAIL;
        const userPassword = process.env.USER_PASSWORD;
        if (!userEmail || !userPassword) {
            throw new Error("USER_EMAIL and USER_PASSWORD must be set in environment");
        }
        const hashedUserPassword = await bcrypt.hash(userPassword, saltRounds);
        await userCollection.insertOne({
            email: userEmail,
            password: hashedUserPassword,
            role: "USER"
        });

        console.log("✅ Default users inserted");
    };
};

// Database query functies
export async function getDrivers(filter = {}, sort = {}) {
    return await driverCollection.find(filter).sort(sort).toArray();
};

export async function getTeams(filter = {}, sort = {}) {
    return await teamCollection.find(filter).sort(sort).toArray();
};

export async function getDriverById(id: string) {
    return await driverCollection.findOne({ id });
};

export async function getTeamById(id: string) {
    return await teamCollection.findOne({ id });
};

export async function getDriversByTeamId(teamId: string) {
    return await driverCollection.find({ "currentTeam.id": teamId }).toArray();
};

export async function updateDriver(id: string, updatedData: Partial<Driver>) {
  return await driverCollection.updateOne(
    { id: id },
    { $set: updatedData }
  );
};

export async function updateTeam(id: string, updatedData: Partial<Team>) {
    return await teamCollection.updateOne(
        { id: id },
        { $set: updatedData }
    );
};

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
};
export async function registerUser(email: string, password: string) {
    // Check of user al bestaat
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
        throw new Error("Email is al in gebruik");
    }

    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(password, 10);

    // Voeg toe aan database met role USER
    await userCollection.insertOne({
        email,
        password: hashedPassword,
        role: "USER"
    });
};