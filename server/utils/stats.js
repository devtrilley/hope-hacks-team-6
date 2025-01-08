// stats.js is made for holding all the fetching & logic related to the REST Countries API

// Importing the Axios npm module for fetching API data
const axios = require("axios");

// Axios asynch function to retrieve REST Countries API data
async function fetchFirstWorlds() {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");

    // Filter our data, then sort it so we only accept countries with a pop. of 10 Mil+
    const countries = response.data
      .filter((country) => country.population > 10000000) 
      .sort((a, b) => b.population - a.population) // Sorts our array from greatest to least
      .slice(0, 20); // Slice only the top 20 countries in our newly sorted list

    return countries;
  } catch (err) {
    console.error(`Error fetching First World Countries: ${err.message}`);
    // throw err;
  }
}

// Export functions to use in app.js
module.exports = { fetchFirstWorlds }; // Exports fetchFirstWorlds function using destructuring