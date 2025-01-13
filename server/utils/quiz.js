document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();

const formData = new FormData(this);
const answers = {};
formData.forEach((value, key) => {
  answers[key] = value;
});

// connection.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL successfully');

//   connection.query('SELECT * FROM questions', (err, results) => {
//     if (err) {
//       console.error('Error fetching questions:', err);
//     } else {
//       console.log('Fetched questions:', results);
//     }
//     connection.end(); // Close the connection
//   });
// });

// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
