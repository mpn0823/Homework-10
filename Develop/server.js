"use strict";

// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

// Server Configuration
const server = express();
const port = process.env.PORT || 8080;
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(__dirname + '/public')); // Thanks Jay DeLeonardis

// Path constants
const DBPATH = "/db/db.json";

// Routes
server.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));
// server.get("*", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
server.get("/api/notes", (req, res) => {
    fs.readFile(DBPATH, "utf8", (err, data) => {
        if (err) console.log(err);
        return res.json(JSON.parse(data));
    });
});

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
// server.post("/api/notes", (req, res) => {
//     fs.readFile(DBPATH, "utf8", (err, data) => {
//         if (err) console.log(err);
//         data = JSON.parse(data);
//         console.log(typeof data, "\n", data);
//         console.log(typeof req.body, "\n", req.body);
//         console.log(data.concat(req.body));
// fs.writeFile(DBPATH, JSON.stringify(data.concat(req.body)), (err) => err ? console.log(err) : null);
// });
// return res.json(req.body);
// });





// Start Server
server.listen(port, function() {
    console.log("App listening on PORT: " + port);
});