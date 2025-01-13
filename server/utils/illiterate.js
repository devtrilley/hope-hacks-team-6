// Function to calculate illiterate population based on percentage documented and total population grabbed from API
function calcIllit(population, illitRate) {
  const illitPopulation = population * (illitRate / 100);
  // console.log(`Population: ${population}, Illit Rate: ${illitRate}`);

  // Floor result, a fraction of a person makes no sense
  // localestring formats result w/ commas for easier reading
  return Math.floor(illitPopulation).toLocaleString(); 
};
// Exports calcIllit() for use in stats.js
module.exports = { calcIllit };
