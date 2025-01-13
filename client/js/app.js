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