// results.js
const stored = localStorage.getItem("playerData");

if (!stored) {
  // If someone visits results page with no data, go back to intro
  window.location.href = "index.html";
}

const player = JSON.parse(stored);

document.getElementById("fullName").textContent =
  player.firstName + " " + player.lastName;

document.getElementById("age").textContent = player.age;
document.getElementById("attempts").textContent = player.attempts;

document.getElementById("playAgain").addEventListener("click", () => {
  // Keep player info but reset attempts
  player.attempts = 0;
  localStorage.setItem("playerData", JSON.stringify(player));
  window.location.href = "game.html";
});

document.getElementById("reset").addEventListener("click", () => {
  localStorage.removeItem("playerData");
  window.location.href = "index.html";
});
