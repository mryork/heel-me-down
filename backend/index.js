// Import Required Libraries
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const { GoogleAuth, OAuth2Client } = require("google-auth-library")
const env = require("dotenv").config()

// Configure our OAuth2Client with a client ID
const CLIENT_ID = ""
const client = new OAuth2Client(CLIENT_ID)

// Define our express.js server
const port = 8080
const app = express()

// Setup our express server
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./frontend'))

app.get("/check", (req, res) => {
    res.status(200);
    res.send("Welcome to Heel Me Down hosted by Carolina CloudApps!");
})

app.listen(port, () => { console.log("App listening on port 8080!")})