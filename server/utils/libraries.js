const request = require("postman-request");
const dotenv = require("dotenv").config();

const findLibraries = (latitude, longitude, callback) => {
  const googlePlacesAPI = process.env.LIBRARY_API;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=library&key=${googlePlacesAPI}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to Google Places API!", undefined);
    } else if (!body.results || body.results.length === 0) {
      callback("No libraries found near this location.", undefined);
    } else {
      const libraries = body.results.map((library) => ({
        name: library.name,
        address: library.vicinity,
        rating: library.rating || "No rating available",
      }));
      callback(undefined, libraries);
    }
  });
};

module.exports = findLibraries;
