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

// Creates a connection to mysql database
const connection = mysql2.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ReadingLiteracyData',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password'
});

// Throws an error or success message if it can or can't connect to mysql server
connection.connect(err => {
  if (err) {
    console.log('Error with connecting to mysql');
  } else {
    console.log('Connected to mysql successfully');
  }
});

// Routes, fetch questions from the database
app.get('/quiz', async (req, res) => {
  connection.query('SELECT * FROM questions', (err, results) => {
    if (err) {
      console.log('Error fetching questions');
      return res.status(500).send('Error fetching questions')
    }
    console.log(results);
    res.render('quiz', { questions: results });
  })
}); 

app.post('/submit-quiz', (req, res) => {
  const answers = req.body; // Gets the submitted answers
  let score = 0; // Starts score off as 0 

  connection.query('SELECT id, correct_option FROM questions', (err, results) => {
  if (err) {
    console.log('Error fetching correct answers');
    return res.status(500).send('Error fetching correct answers');
  }

  // Map of correct answers
  const correctAnswers = {};
  results.forEach(question => {
    correctAnswers[question.id] = question.correct_option;
  });

  // Calculates the score
  // If the answer[questionId] is strictly equal to correctAnswers[questionId], then increase the score
  for (const questionId in answers) {
    if (answers[questionId] === correctAnswers[questionId]) {
      score++;
    }
  }

  // This will stores the results in our sql results table 
  const readingLevel = score >= 3 ? 'Intermediate' : 'Beginner';
  connection.query('INSERT INTO results (score, reading_level) VALUES (?, ?)', [score, readingLevel], (err) => {
    if (err) {
      console.log('Error sending results to sql database');
      return res.status(500).send('Error saving results');
    }
    // Sends back the result
    res.json({ success: true, score, readingLevel});
    });
  });
});
// Starts the Express Server listening at a specific Port
app.listen(PORT, () => {
  // render.com will give us this PORT when we deploy
  console.log(`Server is live at http://localhost:${PORT}`);
});

// Todo's
// Define the paths using that module
