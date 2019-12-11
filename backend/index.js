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

// Post (Item)
var post = mongoose.model('Post', new mongoose.Schema({
    name: String,           // Post Name
    description: String,    // Post Description
    date: Number,           // Posted Date (millis format)
    department: String,     // Department (_ _ _ _)
    number: String,         // Course Number
    price: Number,          // Price of Item
    userName: String,       // Name of User
    userID: String,         // Google ID of User
    sold: Boolean,          // Sold or Not
    googlePic: String       // User Picture from Google
}))

// Inquiry (Asking)
var inquiry = mongoose.model('Inquiry', mongoose.Schema({
    message: String,        // Body of Inquiry
    phoneNumber: String,    // User's Provided Phone #
    email: String,          // User's Provided Email
    postID: String,         // Name of Post Inquired
    userFrom: String,       // From's Name
    userTo: String,         // To's ID
    date: Number,           // Date Sent
    fromUserImg: String     // User Image
}))

// Status Checker
app.get("/status", (req, res) => {
    res.status(200);
    res.send("The Heel Me Down server started successfully.");
})

// Search (params: department, number)
app.post("/api/search", (req,res) => {
    if(req.body.number == undefined &&
        req.body.department != undefined) {

        post.find({ department: req.body.department }).then(vals => {
            res.json(vals)
            res.status(200)
            res.send()
        })
    } else if (req.body.department == undefined) {
        post.find().then(vals => {
            res.json(vals)
            res.status(200)
            res.send()
        })
    } else {
        post.find({ department: req.body.department, number: req.body.number}).then(vals => {
            res.json(vals)
            res.status(200)
            res.send()
        })
    }
})

// Logged in User's Posts
app.post("/api/userPosts", (req,res) => {
    const token = req.body.token;

    verifyUser(token).then((obj) => {
        post.find({userID: obj['sub']}).then((p) => {
            res.json(p);
            res.status(200);
            res.send();
        }).catch((e) => {
            console.log(e);
            res.sendStatus(400);
        })
    }).catch((e) => {
        console.log(e)
        res.sendStatus(400);
    })
})

// Create Post (params: name, description, department, number, price)
app.post("/api/createPost", (req,res) => {
    const token = req.body.token;
    const name = req.body.name;
    const description = req.body.description;
    const department = req.body.department;
    const number = req.body.number;
    const date = Date.now();
    const userName = req.body.userName;
    const sold = false;

    verifyUser(token).then((obj) => {
        console.log(obj)
        user.findOne({id: obj['sub']}).then((u) => {
            if(!u) {
                user.create({id: id, name: name}).then((u) => {
                    post.create({ name: name, description: description, department: department,
                        number: number, userName: userName, sold: sold,
                        userID: u.id, date: date, googlePic: obj['picture'] }).then((p) => {
                        res.sendStatus(200);
                    }).catch(() => {
                        res.sendStatus(400);
                    })
                })
            } else {
                post.create({ name: name, description: description, department: department,
                    number: number, userName: userName, sold: sold,
                    userID: u.id, date: date, googlePic: obj['picture'] }).then(() => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(400);
                })
            }
        })
    })
})

// Item Was Not Sold
app.post("/api/unsold", (req,res) => {
    const token = req.body.token;
    const postID = req.body.id;

    verifyUser(token).then((obj) => {
        post.findOne({_id: postID, userID: obj['sub']}).then((p) => {
            if(!p) {
                res.sendStatus(400);
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

// Item Was Sold
app.post("/api/sold", (req,res) => {
    const token = req.body.token;
    const postID = req.body.id;

    verifyUser(token).then((obj) => {
        post.findOne({_id: postID, userID: obj['sub']}).then((p) => {
            if(!p) {
                res.sendStatus(400);
            } else {
                p.sold = true;
                p.save();

                res.sendStatus(200);
            }
        }).catch((e) => {
            console.log(e);
            res.sendStatus(400);
        })
    }).catch((e) => {
        console.log(e)
        res.sendStatus(400);
    })
})

// Delete a Post
app.post("/api/deletePost", (req,res) => {
    const token = req.body.token;
    const postID = req.body.id;

    verifyUser(token).then((obj) => {
        post.deleteOne({_id: postID, userID: obj['sub']}).then((p) => {
            res.sendStatus(200);
        }).catch((e) => {
            console.log(e);
            res.sendStatus(400);
        })
    }).catch((e) => {
        console.log(e)
        res.sendStatus(400);
    })
})

// Create an Inquiry
app.post("/api/createInquiry", (req,res) => {
    const token = req.body.token;
    const name = req.body.userName;
    const message = req.body.message;
    const phone = req.body.phone;
    const email = req.body.email;
    const userTo = req.body.to;
    const postID = req.body.postID;
    const date = Date.now();
    const fromUserImg = req.body.fromUserImg;

    verifyUser(token).then((obj) => {
        user.findOne({id: obj['sub']}).then((u) => {
            if(!u) {
                user.create({id: id, name: name}).then((u) => {
                    inquiry.create({
                        message: message,
                        phoneNumber: phone,
                        email: email,
                        postID: postID,
                        userTo: userTo,
                        userFrom: u.id,
                        fromUserImg: fromUserImg,
                        date: date
                    }).then((p) => {
                        res.sendStatus(200);
                    }).catch(() => {
                        res.sendStatus(400);
                    })
                })
            } else {
                inquiry.create({
                    name: name,
                    message: message,
                    phoneNumber: phone,
                    email: email,
                    postID: postID,
                    userTo: userTo,
                    userFrom: u.id,
                    fromUserImg: fromUserImg,
                    date: date
                }).then((p) => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(400);
                })
            }
        })
    })
})

// Get Inquiries
app.post("/api/getInquiries", (req,res) => {
    const token = req.body.token;

    verifyUser(token).then((obj) => {
        user.findOne({id: obj['sub']}).then((u) => {
            inquiry.find({ userTo: u.id }).then(results => {
                res.json(results);
                res.status(200);
                res.send();
            });
        });
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

    return payload;
}