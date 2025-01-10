const request = require("postman-request");
const dotenv = require("dotenv").config();

const bookSuggestions = function (readingLevel, callback) {
  const apiKey = process.env.BOOKS_API;

  const levelQueries = {
    // Define reading levels
    K: "picture books + early readers",
    1: "simple stories + picture books + phonics books",
    2: "early chapter books + short stories for kids + easy readers",
    3: "chapter books + independent readers + adventure books",
    4: "middle grade + historical fiction for kids + fantasy for kids",
    5: "complex middle grade books + coming-of-age books + classic children literature",
  };

  // Default query
  const query = levelQueries[readingLevel] || "children's books";

  // API URL
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=10&printType=books&fields=items(volumeInfo(title,authors,imageLinks/thumbnail))&key=${apiKey}`;

  console.log("Making API request with URL:", url);

  const options = {
    method: "GET",
    url,
    json: true,
    headers: {
      accept: "application/json",
    },
  };

  // Make request
  request(options, (error, { body } = {}) => {
    if (error) {
      console.error("Error connecting to Google Books API:", error);
      return callback("Unable to connect to Google Books API", undefined);
    }

    console.log("Full API Response:", JSON.stringify(body, null, 2));

    if (!body.items || body.items.length === 0) {
      console.warn(`No books found for query:" ${query}`);
      return callback("No books found. Try another reading level.", undefined);
    }
    console.log("Books fetched from API:", body.items);

    // Map through results to extract relevant data
    const books = body.items.slice(0, 10).map((item) => ({
      title: item.volumeInfo?.title || "No Title Available",
      authors: item.volumeInfo?.authors
        ? item.volumeInfo.authors.join(", ")
        : "Unknown Author", // Uses optional chaining
      thumbnail:
        item.volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/150", // Uses optional chaining & placeholder for null images
    }));
    callback(undefined, books);
  });
};

module.exports = bookSuggestions;