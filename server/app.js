// This files holds our Node.js/Express server

// Importing NPM modules
const express = require("express"); // express for server app
const path = require("path"); // Import core npm module to handle file paths
const mysql2 = require("mysql2"); // mysql2 modules for interacting with DB
const dotenv = require("dotenv"); // dotenv for our .dotenv
const axios = require("axios"); // axios for our API request/fetching on the server side
const hbs = require("hbs"); // hbs = handlebars
const { fetchFirstWorlds } = require("./utils/stats");

// Calling express() func wich starts our server, storing it in app variable
// app is our server. handles all requests and sends responses.
const app = express();
// const publicDirectoryPath = path.join(__dirname, "../../client");
// console.log(publicDirectoryPath);

const PORT = 3000; // Current port for development

const clientDirPath = path.join(__dirname, "../client");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.set("views", viewsPath);
// SETting up Handlebars as the our view engine
// Tells express to use hbs as our view engine. A view engine allwos express to dynamically render hbs templates
// rather than using static HTML files.
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);
// Setup static directory to serve
app.use(express.static(clientDirPath));

// This sets the views directory. Shows express the exact place to find views.
// __dirname is a special var that gives abs. path of current directory
app.set("views", path.join(__dirname, "../templates", "views"));

// Serving Static files like Img's and CSS. Give us the abs. path to the client directory
// console.log(path.join(__dirname, "../client", "img")); // Testing path
app.use(express.static("client/img"));

// Middleware to automatically parse JSON data into JS. Comes before routes (Ex: app.get())
// Without Middleware, app wouldn't understand incoming data
app.use(express.json());

// Root Route/endpoint. Index.hbs page for our site
app.get("/", (req, res) => {
  // index.hbs rendered, no ext. needed
  res.render("index", {
    title: "Home | BookSprouts",
  });
});

// Statistics Route/endpoint. statistics.hbs page for our site
// Async because we're waiting for our fetchFirstWorlds() to fetch top 20 countries from api
app.get("/stats", async (req, res) => {
  // Try this block first
  try {
    // Waits for func to fetch the top 20 countries
    const countriesData = await fetchFirstWorlds();
    console.log(countriesData);

    // statistics.hbs rendered, no ext. needed
    res.render("stats", {
      // Title
      title: "Stats | BookSprouts",
      // Array of countries
      firstWorldCountries: countriesData,
    });
  } catch (err) {
    // If there's an error, run this block containing error messages
    console.error(`Error fetching First World Countries: ${err.message}`);
    // 500 = Internal Service Error
    res.status(500).send("Error fetching First World Countries");
  }
});

// Starts the Express Server listening at a specific Port
app.listen(PORT, () => {
  // render.com will give us this PORT when we deploy
  console.log(`Server is live at http://localhost:${PORT}`);
});

// Todo's
// Define the paths using that module
