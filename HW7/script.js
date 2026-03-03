
// Load player JSON from localStorage
const stored = localStorage.getItem("playerData");
if (!stored) {
  window.location.href = "index.html"; // prevents skipping intro
}

let player = JSON.parse(stored);

// If you added these spans in game.html:
const attemptsSpan = document.getElementById("attempts");
const playerNameSpan = document.getElementById("playerName");

if (playerNameSpan) {
  playerNameSpan.textContent = player.firstName + " " + player.lastName;
}
if (attemptsSpan) {
  attemptsSpan.textContent = player.attempts;
}

// Arrays

// blank images array (size 12)
let blankImages = [];
for (let i = 0; i < 12; i++) {
  blankImages.push("images/blank.jpg");
}

// actual images array (size 12, 6 pairs)
let actualImages = [
  "images/img1.jpg","images/img1.jpg",
  "images/img2.jpg","images/img2.jpg",
  "images/img3.jpg","images/img3.jpg",
  "images/img4.jpg","images/img4.jpg",
  "images/img5.jpg","images/img5.jpg",
  "images/img6.jpg","images/img6.jpg"
];

// Shuffle (Math.random)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
}

shuffle(actualImages);


// Game state
let board = document.getElementById("gameBoard");

let firstPick = null;   // the first <img> element clicked
let secondPick = null;  // the second <img> element clicked
let lockBoard = false;  // blocks clicking while flipping back
let matchedCount = 0;   // counts matched tiles (2 per pair)

// Helper functions
function updateAttempts() {
  player.attempts += 1;
  if (attemptsSpan) attemptsSpan.textContent = player.attempts;
  localStorage.setItem("playerData", JSON.stringify(player));
}

function resetPicks() {
  firstPick = null;
  secondPick = null;
}

function finishGame() {
  // ensure final attempts stored
  localStorage.setItem("playerData", JSON.stringify(player));
  window.location.href = "results.html";
}

// Display Grid using for loop
for (let i = 0; i < blankImages.length; i++) {
  let img = document.createElement("img");

  img.src = blankImages[i];
  img.dataset.index = i;
  img.dataset.matched = "false"; // track matches

  // sizing
  img.width = 140;
  img.height = 140;
  img.style.objectFit = "cover";
  img.style.margin = "6px";
  img.style.cursor = "pointer";

  // click logic: reveal + match check
  img.addEventListener("click", function () {
    if (lockBoard) return;

    // ignore already matched tiles
    if (this.dataset.matched === "true") return;

    // prevent double-clicking the same tile
    if (firstPick && this === firstPick) return;

    let index = Number(this.dataset.index);

    // reveal
    this.src = actualImages[index];

    // first pick
    if (!firstPick) {
      firstPick = this;
      return;
    }

    // second pick => counts as one attempt
    secondPick = this;
    updateAttempts();

    // check match
    let firstIndex = Number(firstPick.dataset.index);
    let secondIndex = Number(secondPick.dataset.index);

    let isMatch = actualImages[firstIndex] === actualImages[secondIndex];

    if (isMatch) {
      firstPick.dataset.matched = "true";
      secondPick.dataset.matched = "true";
      matchedCount += 2;
      resetPicks();

      // win condition: all tiles matched
      if (matchedCount === blankImages.length) {
        finishGame();
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstPick.src = "images/blank.jpg";
        secondPick.src = "images/blank.jpg";
        resetPicks();
        lockBoard = false;
      }, 800);
    }
  });

  board.appendChild(img);

  // 4 columns x 3 rows
  if ((i + 1) % 4 === 0) {
    board.appendChild(document.createElement("br"));
  }
}
