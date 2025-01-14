// Waits until the DOM is fully loaded before running
document.addEventListener('DOMContentLoaded', function () {
  const modals = document.querySelectorAll('.modal');
  // Intializes the materialize modal
  M.Modal.init(modals);
});

// Waits until the DOM is fully loaded before running the event listener for the quiz form
document.addEventListener('DOMContentLoaded', function () {
  const quizForm = document.getElementById('quiz-form');

  quizForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Creates an object called formData with the data from the forms inputs  
    
    const answers = {}; // Initializes empty answers object

    // Iterates over each entry within the formdata object 
    // Populate the answers object with user inputs
    // Key represents the unique value for the question
    // value stores the users answer
    formData.forEach((value, key) => {
      answers[key] = value;
    });

    // Sends the users answers to the server using the fetch API 
    try {
      const response = await fetch('/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicating that the data is JSON 
        },
        body: JSON.stringify(answers), // Converts answers object into a string 
      });

      const result = await response.json(); // Parsing JSON response from the server

      if (result.success) {
        // Populates modal with the quiz results using template literals
        document.getElementById('modal-score').textContent = `Score: ${result.score}`;
        document.getElementById('modal-reading-level').textContent = `Reading Level: ${result.readingLevel}`;

        // Opens the modal to display the results, alerts an error if not able to display results
        const modalInstance = M.Modal.getInstance(document.getElementById('result-modal'));
        modalInstance.open();
      } else {
        alert('Error processing your quiz results.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Something went wrong. Please try again.');
    }
  });
});
