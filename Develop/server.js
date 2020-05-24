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

// Path to database
const DBPATH = "./db/db.json";

// Reads database file and returns all saved notes as JSON
server.get("/api/notes", (req, res, next) => {
    fs.readFile(DBPATH, "utf8", (err, data) => {
        if (err) next(err);
        return res.json(JSON.parse(data));
    });
});

// Upon receiving new note, assigns a unique id, saves to the database, and returns note to client
server.post("/api/notes", (req, res, next) => {
    const note = {
        title: req.body.title,
        text: req.body.text,
        id: uuid(),
    };
    fs.readFile(DBPATH, "utf8", (err, data) => {
        if (err) next(err);
        const output = JSON.stringify(JSON.parse(data).concat(note));
        fs.writeFile(DBPATH, output, (err) => { if (err) next(err) });
    });
    return res.json(note);
});

// Upon receiving a unique id, deletes corresponding note from the database and returns id to client
server.delete("/api/notes/:id", (req, res) => {
    fs.readFile(DBPATH, "utf8", (err, data) => {
        if (err) next(err);
        const output = JSON.stringify(JSON.parse(data).filter(note => note.id !== req.params.id));
        fs.writeFile(DBPATH, output, (err) => { if (err) next(err) });
    });
    return res.send(req.body.id);
});

// HTML routes
server.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));
server.get("*", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

// Start Server
server.listen(port, function() {
    console.log("Server listening on PORT: " + port);
});