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
const port = 80
const app = express()