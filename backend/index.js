// Import Required Libraries
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const { GoogleAuth, OAuth2Client } = require("google-auth-library")
const env = require("dotenv").config()
const colors = require('colors');

// Configure our OAuth2Client with a client ID
const CLIENT_ID = "99875682429-69chpnsjo1jnlb9o0iivqjv7ghjbirrp.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID)
const client_secret = process.env.GOOGLE_SECRET

// Define our express.js server
const port = 8080
const app = express()

// Setup our express server
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./frontend'))

var user = mongoose.model('User', new mongoose.Schema({ id: String, name: String }))
var post = mongoose.model('Post', new mongoose.Schema({ department: String, number: String, materials: String, sold: Boolean, user: String, userName: String }))
var inquiry = mongoose.model('Inquiry', mongoose.Schema({ post: String, body: String, date: String, from: String}))

app.get("/status", (req, res) => {
    res.status(200);
    res.send("The Heel Me Down server started successfully.");
})

/**
 * Search API Endpoint
 * 
 * Returns a list of posts based on search 
 */
app.post("/api/search", (req,res) => {
    const department = req.body.dept;
    const number = req.body.number;

    post.find({ department: department, number: number }).then((vals) => {
        console.log(vals);
        res.json(vals);
        res.status(200);
        res.send();
    })
})

app.post("/api/post", (req,res) => {
    const token = req.body.token;
    const name = req.body.name;
    const department = req.body.department;
    const number = req.body.number;
    const materials = req.body.materials;
    const sold = false;

    verifyUser(token).then((id) => {
        user.findOne({id: id}).then((u) => {
            if(!u) {
                user.create({id: id, name: name}).then((u) => {
                    post.create({ userName: name, department: department, number: number, materials: materials, sold: sold, user: u.id}).then(() => {
                        res.sendStatus(200);
                    }).catch(() => {
                        res.sendStatus(400);
                    })
                })
            } else {
                post.create({ userName: name, department: department, number: number, materials: materials, sold: sold, user: u.id}).then(() => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(400);
                })
            }
        })
    })
})

app.post("/api/unsold", (req,res) => {
    const token = req.body.token;
    const postID = req.body.id;

    verifyUser(token).then((id) => {
        post.findOne({id: postID, user: id}).then((p) => {
            if(!u) {
                res.sendStatus(401);
            } else {
                p.sold = false;
                p.save();

                res.sendStatus(200);
            }
        }).catch(() => {
            res.sendStatus(400);
        })
    }).catch(() => {
        res.sendStatus(400);
    })
})

app.post("/api/sold", (req,res) => {
    const token = req.body.token;
    const postID = req.body.id;

    verifyUser(token).then((id) => {
        post.findOne({id: postID, user: id}).then((p) => {
            if(!u) {
                res.sendStatus(401);
            } else {
                p.sold = true;
                p.save();

                res.sendStatus(200);
            }
        }).catch(() => {
            res.sendStatus(400);
        })
    }).catch(() => {
        res.sendStatus(400);
    })
})

app.post("/api/sold", (req,res) => {
    const token = req.body.token;
    const postID = req.body.id;
    const materials = req.body.materials;

    verifyUser(token).then((id) => {
        post.findOne({id: postID, user: id}).then((p) => {
            if(!u) {
                res.sendStatus(401);
            } else {
                p.materials = materials;
                p.save();

                res.sendStatus(200);
            }
        }).catch(() => {
            res.sendStatus(400);
        })
    }).catch(() => {
        res.sendStatus(400);
    })
})

mongoose.connect(process.env.MONGO_HOST, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(port, () => { console.log("Heel Me Down".blue.bold + " connected to MongoDB and started successfully, listening on port 8080!".blue)})
}).catch((err) => {
    console.log("There was an error starting the Heel Me Down server: " + err);
})

async function verifyUser(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return userid;
}