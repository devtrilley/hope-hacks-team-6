// This files holds our Node.js/Express server

// Importing NPM modules
const express = require("express"); // express for server app
const path = require("path"); // Import core npm module to handle file paths
const mysql2 = require("mysql2"); // mysql2 modules for interacting with DB
const dotenv = require("dotenv"); // dotenv for our .dotenv
const axios = require("axios"); // axios for our API request/fetching on the server side
const hbs = require("hbs"); // hbs = handlebars

// Calling express() func wich starts our server, storing it in app variable
// app is our server. handles all requests and sends responses.
const app = express();

const PORT = 3000; // Current port for development

// SETting up Habdlebars as the our view engine
// Tells express to use hbs as our view engine. A view engine allwos express to dynamically render hbs templates
// rather than using static HTML files.
app.set("view engine", "hbs");

// This sets the views directory. Shows express the exact place to find views.
// __dirname is a special var that gives abs. path of current directory
app.set("views", path.join(__dirname, "../templates", "views"));

// Serving Static files like Img's and CSS. Give us the abs. path to the public directory
app.use(express.static(path.join(__dirname, "../templates", "public")));

// Middleware to automatically parse JSON data into JS. Comes before routes (Ex: app.get())
// Without Middleware, app wouldn't understand incoming data
app.use(express.json());

// Root Route/endpoint. Index.hbs page for our site
app.get("/", (req, res) => {
  // Index.hbs rendered, no ext. needed
  res.render("index", {
    title: "Statistics | BookSprouts",
  });
});

// Starts the Express Server listening at a specific Port
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

// Todo's
// Define the paths using that module
