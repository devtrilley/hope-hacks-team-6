// Dynamically creating buttons for the reading level page
document.addEventListener("DOMContentLoaded", () => {
  const gradeLevels = [
    { name: "Kindergarten", level: "K" },
    { name: "1st Grade", level: "1" },
    { name: "2nd Grade", level: "2" },
    { name: "3rd Grade", level: "3" },
    { name: "4th Grade", level: "4" },
    { name: "5th Grade", level: "5" },
  ];

  const container = document.getElementById("grade-buttons");

  gradeLevels.forEach((grade) => {
    const button = document.createElement("button");
    button.classList.add("grade-button"); // Materialize button class
    button.textContent = grade.name;
    button.onclick = () => {
      // Redirect to /books with the correct grade level as a query parameter
      window.location.href = `/books?level=${grade.level}`;
    };
    container.appendChild(button);
  });
});

// Handle the library page
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from submitting the default way 

  const address = document.querySelector('input[name="address"]').value;
  const message1 = document.getElementById('message-1'); // For error or loading messages
  const message2 = document.getElementById('message-2'); // For displaying the results

  // Show loading message
  message1.textContent = 'Loading...';
  message2.textContent = '';

  // Fetch local libraries using the address input
  fetch(`/local?address=${encodeURIComponent(address)}`)
    .then((response) => response.json())
    .then((data) => {
      // Check if there's an error message
      if (data.error) {
        message1.textContent = data.error;
      } else {
        // Display location and libraries info
        message1.textContent = `Libraries found near: ${data.location}`;
        message2.innerHTML = '<ul>' + data.libraries.map(library => {
          return `<li><strong>${library.name}</strong><br>Address: ${library.address}<br>Rating: ${library.rating}</li>`;
        }).join('') + '</ul>';
      }
    })
    .catch((error) => {
      message1.textContent = 'Error fetching libraries. Please try again.';
      console.log(error);
    });
});

