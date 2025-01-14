// This files holds our Node.js/Express server

// Importing NPM modules
const express = require("express"); // express for server app
const path = require("path"); // Import core npm module to handle file paths
const mysql2 = require("mysql2"); // mysql2 modules for interacting with DB
const dotenv = require("dotenv"); // dotenv for our .dotenv
const axios = require("axios"); // axios for our API request/fetching on the server side
const hbs = require("hbs"); // hbs = handlebars
const cors = require("cors");
const { fetchFirstWorlds } = require("./utils/stats");
const bookSuggestions = require("./utils/book"); // Import the bookSuggestions function
const geocode = require("./utils/geocode"); // Import the geocode function
const findLibraries = require("./utils/libraries"); // Import findLibraries function

// Calling express() func wich starts our server, storing it in app variable
// app is our server. handles all requests and sends responses.
const app = express();
// const publicDirectoryPath = path.join(__dirname, "../../client");
// console.log(publicDirectoryPath);

// Allow all origins (for development purposes)
app.use(cors());
dotenv.config();
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
app.use(express.urlencoded({ extended: true }));
app.use('/server/utils', express.static(path.join(__dirname, 'utils')));

// This sets the views directory. Shows express the exact place to find views.
// __dirname is a special var that gives abs. path of current directory


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

// Route to get bookSuggestions function and pass the reading level
app.get("/readinglevel", (req, res) => {
  res.render("readinglevel", {
    title: "Select Your Reading Level",
  });
});

app.get("/books", (req, res) => {
  const level = req.query.level;

  // Fetch books based on the level
  bookSuggestions(level, (error, books) => {
    if (error) {
      console.error("Error from bookSuggestions:", error);
      return res.render("error", {
        message: "Unable to fetch books. Please try again.",
      });
    }

    // If books found, render the template
    if (books && books.length > 0) {
      console.log("Books fetched successfully:", books);
      return res.render("books", {
        title: "Suggested Books",
        level, // Pass the reading level to the template
        books, // Pass book list to the template
      });
    } else {
      return res.render("error", {
        message: "No books found for this level",
      });
    }
  });
});

// Route to handle the /library request
app.get("/library", (req, res) => {
  res.render("library", {
    title: "Find a Local Library",
  });
});

app.get("/local", (req, res) => {
  console.log("Received address:", req.query.address);  // This will show the address received in the request

  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  // Get latitude and longitude from geocode
  geocode(req.query.address, (error, { latitude, longitude, location }) => {
    if (error) {
      return res.send({ error });
    }
    console.log('Latitude:', latitude, 'Longitude:', longitude);  // Log the coordinates

    // Find libraries near the location
    findLibraries(latitude, longitude, (error, libraries) => {
      if (error) {
        return res.send({ error });
      }

      // Log the libraries returned from Places API
      console.log('Libraries found:', libraries);

      // Render libraries in view
      res.render("libraries", {
        title: "Local Libraries",
        location,
        libraries,
      });
    });
  });
});

// Creates a connection to mysql database
const connection = mysql2.createConnection({
  host: process.env.DB_HOST || 'database-1.cpio2yskwx8h.us-east-2.rds.amazonaws.com',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ReadingLiteracyData',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'z4frv9sjhcmp5gre'
});

// Throws an error or success message if it can or can't connect to mysql server
connection.connect(err => {
  if (err) {
    console.log('Error with connecting to mysql');
  } else {
    console.log('Connected to mysql successfully');
  }
});

// Routes and Queries the questions from the database, selects the questions and option tables
// Gives errors if it cant fetch questions
app.get("/quiz", (req, res) => {
  const query = `
    SELECT q.id AS question_id, q.question, q.correct_answer,
           o.answer_choice, o.answer_value
    FROM questions q
    LEFT JOIN option_items o ON q.id = o.question_id
    ORDER BY q.id, o.answer_choice;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).send("Error fetching questions.");
    }


    // Creates an empty array called questionsArray, loops through each row of results, then checks if a question with the same id already exists
    // If the question with the same id already exists, then it will retrieve the question, if not, then it will create a new question object and
    // will fill out the properties. The question is then pushed into the questionsArray
    const questionsArray = [];
    results.forEach((row) => {
      let question = questionsArray.find((q) => q.id === row.question_id);
      if (!question) {
        question = {
          id: row.question_id,
          question: row.question,
          correct_answer: row.correct_answer,
          options: [],
        };
        questionsArray.push(question);
      }
      // Adds the question options to options array of the corresponding questions
      question.options.push({
        choice: row.answer_choice,
        value: row.answer_value,
      });
    });

    res.render('quiz', { questions: questionsArray });
  });
});

// Handle quiz submission
app.post("/submit-quiz", (req, res) => {
  const userAnswers = req.body; // User-submitted answers
  let score = 0; // Starts the score at 0 

  // SQL query to fetch the question_ids and correct_answers from the sql database
  const query = `
    SELECT id AS question_id, correct_answer FROM questions;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching correct answers:", err);
      return res.status(500).send("Error fetching correct answers.");
    }

    // Maps the results to create an array with their correct answers 
    const questionsArray = results.map((row) => ({
      id: row.question_id,
      correctAnswer: row.correct_answer,
    }));

    // Calculate the score
    questionsArray.forEach((question) => {
      const userAnswer = userAnswers[question.id]; // Users answer for the current question
      if (userAnswer === question.correctAnswer) { // Checks if the users answer is correct
        score++; // If the answer is correct and matches the correct answer id, then the score increases by 1
      }
    });

    // Determine users reading level
    let readingLevel = "Kindergarten";
    if (score >= 4 && score <= 6) readingLevel = "Grade 1";
    else if (score >= 7 && score <= 9) readingLevel = "Grade 2";
    else if (score >= 10 && score <= 12) readingLevel = "Grade 3";
    else if (score >= 13 && score <= 15) readingLevel = "Grade 4";
    else if (score >= 16 && score <= 18) readingLevel = "Grade 5";


    // SQL query to insert the users score and reading level to the sql results table in the database
    const insertQuery = `
      INSERT INTO results (score, reading_level) VALUES (?, ?);
    `;
    // Executes insert query and checks for errors 
    connection.query(insertQuery, [score, readingLevel], (insertErr) => {
      if (insertErr) {
        console.error("Error saving results to database:", insertErr);
        return res.status(500).send("Error saving results.");
      }
      
      res.json({ success: true,  score, readingLevel });
    });
  });
});


// Starts the Express Server listening at a specific Port
app.listen(PORT, () => {
  // render.com will give us this PORT when we deploy
  console.log(`Server is live at http://localhost:${PORT}`);
});