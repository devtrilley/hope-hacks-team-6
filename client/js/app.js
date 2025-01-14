// Dynamically creating buttons for the reading level page
document.addEventListener("DOMContentLoaded", () => {
  const gradeLevels = [
    { name: "Kindergarten", level: "K", imgSrc: "/img/cailou.png"},
      { name: "1st Grade", level: "1", imgSrc: "/img/peppa.png"},
      { name: "2nd Grade", level: "2", imgSrc: "/img/elmo.png"},
      { name: "3rd Grade", level: "3", imgSrc: "/img/cyberchase.png"},
      { name: "4th Grade", level: "4", imgSrc: "/img/pokemon.png"},
      { name: "5th Grade", level: "5", imgSrc: "/img/dw.png"},
  ];

  const container = document.getElementById("grade-buttons");

  gradeLevels.forEach((grade) => {
    // Create a container for the image and button
    const group = document.createElement("div");
    group.classList.add("grade-group");

    //display the image 
     const img = document.createElement("img");
     img.src = grade.imgSrc;
     img.alt = `${grade.name} Image`;
     img.classList.add("grade-image");

    //display the button
    const button = document.createElement("button");
    button.classList.add("grade-button"); // Materialize button class
    button.textContent = grade.name;
    button.style.backgroundColor = getButtonColor(grade.level);
    button.onclick = () => {
      // Redirect to /books with the correct grade level as a query parameter
      window.location.href = `/books?level=${grade.level}`;
    };

    //append the image and button to the group 
    group.appendChild(img);
    group.appendChild(button);

    // Append the group to the container
    container.appendChild(group);
  });
  function getButtonColor(level) {
    const colors = {
      K: "#E31E22",
      "1": "#ED7622",
      "2": "#FFD303",
      "3": "#A8CF4E",
      "4": "#4EC0FF",
      "5": "#956EA4",
    };
    return colors[level] || "#000000";
  }
  });