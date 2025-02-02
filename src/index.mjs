// dependencies
import helmet from 'helmet'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import 'dotenv/config'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport';
import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

import hraciRouter from "./routes/hraci.mjs"

//models

import User from "./models/User.mjs"

//connect db
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_IP}:27017/football`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "football", // If the user was created in the 'admin' database
})
.then(() => console.log("Connected to MongoDB!"))
.catch(err => console.error("MongoDB connection error:", err));

//app setup and middleware
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
app.use(hraciRouter)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//session setup
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_IP}:27017/football`,
        mongoOptions: { authSource: "football" }, // Ensures authentication works
        collectionName: "passport-auth" // Ensures sessions are stored in the correct collection
    }),
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

app.use(passport.initialize());
app.use(passport.session());
//Passport setup
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Incorrect password" });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Show login form
app.get("/login", (req, res) => {
    res.render("login");
});

// Handle login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}));

// Show register form
app.get("/register", (req, res) => {
    res.render("register");
});

// Handle registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = new User({ username, password: hashedPassword, players: [] });
        await user.save();
        res.redirect("/login");
    } catch (err) {
        res.redirect("/register");
    }
});

// Dashboard (protected route)
app.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    res.render("dashboard", { user: req.user });
});

// Logout
app.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/login");
    });
});

app.post("/createPlayer", async (req, res) =>{
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id; // or req.user._id depending on your schema
    const newPlayer = req.body.username; // assuming 'player' is the new player data to be added

    try {
        // Find the user by their ID and update the 'players' array
        const user = await User.findByIdAndUpdate(
            userId, 
            { $push: { players: newPlayer } }, // '$push' adds an element to the 'players' array
            { new: true } // Return the updated user document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back the updated user data
        //res.json(user);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating players" });
    }


})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "index.html"))
})

app.get("/tracker", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "tracker.html"))
})

app.get("/mtracker", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "mtracker.html"))
})

app.listen(process.env.PORT, () => console.log(`Running on port: ${process.env.PORT}`))