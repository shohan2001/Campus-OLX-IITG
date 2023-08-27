require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoute");
const cors = require("cors");
const path = require("path");

// for encryting our id and then sending it to the browser
// note our _id is secret.

app.use(cors( ));
// use express session middleware
app.use(
    // to ecnrypt our id (in cookie) and then send it to the browser
    // give a name to cookie
    require("express-session")({
        secret: "thisismysessionsecret", // put in env file later
        cookie: { name: "olxSession", maxAge: 60 * 60 * 1000 },
        resave: true,
        saveUninitialized: true,
        // make set Cookie secure
        // secure: true,
        // make set-cookie same site secure
        sameSite: "none",
    })
);
// this deserializes the user by calling deserializeUser function

// initialize passport
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/product", productRoutes);
app.use("/", authRoutes);
app.use(express.static("client/build"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
if (process.env.NODE_ENV === "production") {
    //set static folder

    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

mongoose
    .connect(
        "mongodb+srv://shohan_01:5L7FSFOfQkukzTDD@iitg-olx-database.6t1vyor.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(
        app.listen(process.env.PORT || 5000, () => {
            console.log("Connected");
        })
    );
