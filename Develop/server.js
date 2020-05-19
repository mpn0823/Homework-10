"use strict";

// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

// Server Configuration
const server = express();
const port = process.env.PORT || 8080;
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(__dirname + '/public')); // Thanks Jay DeLeonardis

// Path constants
const DBPATH = "./db/db.json";

// Routes
server.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));
server.get("*", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
server.get("/api/notes", (req, res) => {
    fs.readFile(DBPATH, "utf8", (err, data) => {
        if (err) console.log(err);
        return res.json(JSON.parse(data));
    });
});

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
server.post("/api/notes", (req, res) => {
    fs.readFile(DBPATH, "utf8", (err, data) => {
        if (err) console.log(err);
        // Create note object corresponding to req data with unique id
        const note = {
            title: req.body.title,
            text: req.body.text,
            id: uuid(),
        };
        const output = JSON.stringify(JSON.parse(data).concat(note));
        fs.writeFile(DBPATH, output, (err) => { if (err) console.log(err) });
    });
    return res.json(req.body);
});

// DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.



// Start Server
server.listen(port, function() {
    console.log("App listening on PORT: " + port);
});