#BookSprouts
Developers: Tom Rilley, Morgan Moncur, Tyler Krug, Sky Patterson-Baker

##Project Overview
BookSprouts is a project created to raise awareness about illiteracy in America, particularly focusing on youth literacy. The website allows users to:

Take a pretest to assess their reading level.
Get personalized book recommendations based on their reading level.
Learn about global and U.S. illiteracy statistics.
View book suggestions dynamically displayed as cards based on the user's reading level from the aforementioned pretest.

##Table of Contents
Installation Instructions
Usage
Technologies Used
Project Structure
Database Setup
License
Contact

##Installation Instructions
###Prerequisites:
Node.js (v12 or higher)
MySQL (hosted on Amazon RDS for this project)

##Steps:
Clone the repository:

bash

Verify

Open In Editor
Run
Copy code
git clone https://github.com/devtrilley/hope-hacks-team-6.git
Install dependencies: Navigate to the project directory and run:

bash

Verify

Open In Editor
Run
Copy code
npm install
Set up environment variables: Create a .env file in the root directory and define the following variables:

makefile

Verify

Open In Editor
Run
Copy code
DB_HOST=your_database_host
DB_PORT=3306
DB_NAME=ReadingLiteracyData
DB_USER=your_database_user
DB_PASSWORD=your_database_password
BOOKS_API=your_google_books_api_key
Start the server:

bash

Verify

Open In Editor
Run
Copy code
node server/app.js
The server will be running on http://localhost:3000.

##Usage
Navigate to http://localhost:3000 to visit the homepage.
Take the Reading Level Quiz: Access the quiz at http://localhost:3000/quiz, answer the questions, and get your reading level.
Get Book Recommendations: After completing the quiz, you'll be directed to a page with book suggestions based on your reading level.
Explore Statistics: Visit http://localhost:3000/stats to view literacy statistics across different countries and states.
Technologies Used
Node.js: JavaScript runtime for server-side development.
Express.js: Web framework for Node.js to handle routing and server logic.
Handlebars: Templating engine for rendering dynamic HTML.
MySQL2: Database client for interacting with a MySQL database (hosted on Amazon RDS).
Axios: HTTP client for making API requests to external services.
Materialize: CSS framework for responsive design and UI components.
Google Books API: API for retrieving book data based on reading level.
Project Structure
/server.js: Main server file to start the Express app.
/app.js: Contains the backend logic for routes, database connections, and rendering templates.
/utils/: Directory with utility files for handling illiteracy calculations, formatting numbers, fetching statistics, and book recommendations.
/templates/: Handlebars views and partials for rendering dynamic content (e.g., homepage, quiz, book suggestions).
/client/: Static files (CSS, JavaScript, images) served by Express.
Database Setup
The database for storing quiz results and user information is hosted on Amazon RDS. The connection details are set up in the .env file.

##License
This project is licensed under the MIT License.

##Contact
For any inquiries or feedback, you can reach out via booksprouts@gmail.com.

