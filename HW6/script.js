// - Arrays -

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

// -Shuffle (Math.random) -
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
}

shuffle(actualImages);

// - Display Grid using for loop -
let board = document.getElementById("gameBoard");

for (let i = 0; i < blankImages.length; i++) {
  let img = document.createElement("img");

  img.src = blankImages[i];
  img.dataset.index = i;

  // sizing
  img.width = 140;
  img.height = 140;
  img.style.objectFit = "cover";     // for photo crops
  img.style.margin = "6px";
  img.style.cursor = "pointer";

  // - click to reveal -
  img.addEventListener("click", function () {
    let index = this.dataset.index;
    this.src = actualImages[index];
  });

  board.appendChild(img);

  // 4 columns x 3 rows
  if ((i + 1) % 4 === 0) {
    board.appendChild(document.createElement("br"));
  }
}
