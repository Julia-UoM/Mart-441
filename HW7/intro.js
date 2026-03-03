// intro.js
document.getElementById("startBtn").addEventListener("click", () => {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const ageRaw = document.getElementById("age").value.trim();
  const error = document.getElementById("error");

  error.textContent = "";

  // Validate: no blanks
  if (!firstName || !lastName || !ageRaw) {
    error.textContent = "Please fill out all fields.";
    return;
  }

  // Validate: age is a number
  const age = Number(ageRaw);
  if (!Number.isFinite(age) || age <= 0) {
    error.textContent = "Age must be a valid number.";
    return;
  }

  // Player JSON object 
  const player = {
    firstName: firstName,
    lastName: lastName,
    age: age,
    attempts: 0
  };

  // Save to localStorage
  localStorage.setItem("playerData", JSON.stringify(player));

  // Redirect to the game page 
  window.location.href = "game.html";
});
