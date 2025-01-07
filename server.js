// This files holds our Node.js/Express server

// Importing NPM modules
const express = require("express"); // express for server app
const mysql2 = require("mysql2"); // mysql2 modules for interacting with DB
const dotenv = require("dotenv"); // dotenv for our .dotenv
const axios = require("axios"); // axios for our API request/fetching on the server side
const hbs = require("hbs"); // hbs = handlebars

// Calling express() func wich starts our server, storing it in app variable
// app is our server. handles all requests and sends responses.
const app = express();

const PORT = 3000; // Current port for development

// Middleware to automatically parse JSON data into JS. Comes before routes (Ex: app.get())
// Without Middleware, app wouldn't understand incoming data
app.use(express.json());
