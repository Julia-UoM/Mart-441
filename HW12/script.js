let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let bgColor = "#eaf4ec";
let flashTimer = 0;

class Box {
  constructor(x, y, width, height, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.baseWidth = width;
    this.baseHeight = height;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

let player = new Box(100, 100, 60, 60, "#f2b6cc", 0, 0);
let enemy = new Box(500, 300, 70, 70, "#b9e3c6", 3, 2);

let keys = {};

document.addEventListener("keydown", function(event) {
  keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
  keys[event.key] = false;
});

function movePlayer() {
  let moveSpeed = 5;

  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= moveSpeed;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.x += moveSpeed;
  }
  if (keys["ArrowUp"] || keys["w"]) {
    player.y -= moveSpeed;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    player.y += moveSpeed;
  }

  // keep player inside canvas
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
  }
}

function moveEnemy() {
  enemy.x += enemy.speedX;
  enemy.y += enemy.speedY;

  // bounce off edges
  if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
    enemy.speedX *= -1;
  }
  if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
    enemy.speedY *= -1;
  }
}

function hasCollided(object1, object2) {
  return (
    object1.x < object2.x + object2.width &&
    object1.x + object1.width > object2.x &&
    object1.y < object2.y + object2.height &&
    object1.y + object1.height > object2.y
  );
}

function handleCollision() {
  if (hasCollided(player, enemy)) {
    bgColor = "#ddd6f5";
    flashTimer = 10;

    player.width = player.baseWidth + 20;
    player.height = player.baseHeight + 20;

    enemy.width = enemy.baseWidth + 20;
    enemy.height = enemy.baseHeight + 20;
  } else {
    player.width = player.baseWidth;
    player.height = player.baseHeight;

    enemy.width = enemy.baseWidth;
    enemy.height = enemy.baseHeight;
  }
}

function updateBackground() {
  if (flashTimer > 0) {
    flashTimer--;
  } else {
    bgColor = "#eaf4ec";
  }

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveEnemy();
  handleCollision();
  updateBackground();

  player.draw();
  enemy.draw();
}

setInterval(update, 1000 / 60);
