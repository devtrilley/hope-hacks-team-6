// stats.js is made for holding all the fetching & logic related to the REST Countries API

// Importing the Axios npm module for fetching API data
const axios = require("axios");
console.log("Attempting to import illiterate module");
const { calcIllit } = require("../utils/illiterate");
console.log("Illiterate module imported");

// Static list of first world countries. Used this list to grab filtered data from API using name
// Illiteracy rates taken from PIAAC and OECD. Appropriate data for stats.js
const firstWorldCountries = [
  { country: "Canada", illitRate: 0.167 },
  { country: "Germany", illitRate: 0.002 },
  { country: "United Kingdom", illitRate: 0.164 },
  { country: "France", illitRate: 0.281 },
  { country: "Japan", illitRate: 0.049 },
  { country: "Australia", illitRate: 0.212 },
  { country: "South Korea", illitRate: 0.126 },
  { country: "Norway", illitRate: 0.004 },
  { country: "Sweden", illitRate: 0.133 },
  { country: "Denmark", illitRate: 0.141 },
  { country: "Netherlands", illitRate: 0.244 },
  { country: "Switzerland", illitRate: 0.249 },
  { country: "New Zealand", illitRate: 0.212 },
  { country: "Austria", illitRate: 0.249 },
  { country: "Belgium", illitRate: 0.156 },
  { country: "Italy", illitRate: 0.158 },
  { country: "Portugal", illitRate: 0.148 },
];

// Axios asynch function to retrieve REST Countries API data
async function fetchFirstWorlds() {
  try {
    // array where we will push api data to
    const countriesData = [];

    // Fetch API array data for United States, returns three objects
    const usResponse = await axios.get(
      "https://restcountries.com/v3.1/name/United%20States?fields=name,population,flags"
    );

    // Uses name.official to select the U.S.A. object out of the 3 returned
    const unitedStates = usResponse.data.find(
      (country) => country.name.official === "United States of America"
    );

    // If the USA is there, grab the population, illitPop, and push an object to countriesData
    if (unitedStates) {
      const usPopulation = unitedStates.population;
      const illitPopulation = calcIllit(usPopulation, 0.21); // Returned value saved
      countriesData.push({
        country: "United States",
        population: usPopulation,
        illitRate: 0.21,
        illitPopulation: illitPopulation,
        flagUrl: unitedStates.flags.svg, // Adding flag svg
      });
    }

    // Loop through each country in firstWorldCountries array using for of loop (for objs)
    for (const country of firstWorldCountries) {
      // Fetch population data from API
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${country.country}?fields=name,population,flags`
      );

      // Chooses the first obj for each countries api call search
      const countryData = response.data[0];

      // If there is a country and it has a population stats
      if (countryData && countryData.population) {
        // Grabs the population from returned data (only one country is returned each time)
        const population = response.data[0].population;

        // Calculate illetrate pop using imported calcIllit func, passing the population from the api as well as the illitRate from our firstWorldCountries array
        const illitPopulation = calcIllit(population, country.illitRate);

        

        // Push object of country details
        countriesData.push({
          country: country.country,
          population: population,
          illitRate: country.illitRate,
          illitPopulation: illitPopulation,
          flagUrl: countryData.flags.svg
        });
      }
    }

    //  Return the filtered
    return countriesData;
  } catch (err) {
    console.error(`Error fetching First World Countries: ${err.message}`);
  }
}

// Export functions to use in app.js
module.exports = { fetchFirstWorlds }; // Exports fetchFirstWorlds function using destructuring
