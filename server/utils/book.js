const request = require("postman-request");

const bookSuggestions = function (readingLevel, callback) {
  const apiKey = "AIzaSyCF5L78hZhSBIfOzfYH1mT9wPbgNjg0V8M";

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
      callback("Unable to connect to Google Books API", undefined);
    } else if (!body.items || body.items.length === 0) {
      callback("No books found. Try another reading level.", undefined);
    } else {
      // Map through results to extract relevant data
      const books = body.items.slice(0, 15).map((item) => ({
        title:
      }));
    }
  });
};
