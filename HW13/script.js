let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let obstacles = [];
let collectibles = [];
let score = 0;
let keys = {};
let gameWon = false;

let exitPortal = {
  x: 730,
  y: 530,
  width: 40,
  height: 40
};

class Player {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 4;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (gameWon) {
      return;
    }

    let nextX = this.x;
    let nextY = this.y;

    if (keys["ArrowLeft"]) {
      nextX -= this.speed;
    }
    if (keys["ArrowRight"]) {
      nextX += this.speed;
    }
    if (keys["ArrowUp"]) {
      nextY -= this.speed;
    }
    if (keys["ArrowDown"]) {
      nextY += this.speed;
    }

    if (nextX < 0) {
      nextX = 0;
    }
    if (nextY < 0) {
      nextY = 0;
    }
    if (nextX + this.width > canvas.width) {
      nextX = canvas.width - this.width;
    }
    if (nextY + this.height > canvas.height) {
      nextY = canvas.height - this.height;
    }

    let blocked = false;

    for (let obstacle of obstacles) {
      if (
        hasCollidedBox(
          nextX,
          nextY,
          this.width,
          this.height,
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        )
      ) {
        blocked = true;
      }
    }

    if (!blocked) {
      this.x = nextX;
      this.y = nextY;
    }
  }
}

class Obstacle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Collectible {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.active = true;
  }

  draw() {
    if (this.active) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

let player = new Player(30, 30, 30, 30, "#bba7e8");

document.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});

function hasCollidedBox(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
}

function checkCollectibles() {
  for (let i = collectibles.length - 1; i >= 0; i--) {
    let item = collectibles[i];

    if (
      item.active &&
      hasCollidedBox(
        player.x,
        player.y,
        player.width,
        player.height,
        item.x,
        item.y,
        item.width,
        item.height
      )
    ) {
      item.active = false;
      collectibles.splice(i, 1);
      score++;
    }
  }
}

function drawExitPortal() {
  if (collectibles.length === 0) {
    ctx.fillStyle = "rgba(255, 200, 230, 0.35)";
    ctx.beginPath();
    ctx.arc(exitPortal.x + 20, exitPortal.y + 20, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffd8ea";
    ctx.beginPath();
    ctx.arc(exitPortal.x + 20, exitPortal.y + 20, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#9a6f88";
    ctx.font = "14px Arial";
    ctx.fillText("EXIT", exitPortal.x - 2, exitPortal.y - 8);
  }
}

function checkWin() {
  if (
    collectibles.length === 0 &&
    hasCollidedBox(
      player.x,
      player.y,
      player.width,
      player.height,
      exitPortal.x,
      exitPortal.y,
      exitPortal.width,
      exitPortal.height
    )
  ) {
    gameWon = true;
  }
}

function drawScore() {
  ctx.fillStyle = "#7f7082";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

function drawInstructions() {
  ctx.fillStyle = "#7f7082";
  ctx.font = "16px Arial";

  if (!gameWon && collectibles.length > 0) {
    ctx.fillText("Collect all the orbs, then go to the portal.", 20, 60);
  } else if (!gameWon && collectibles.length === 0) {
    ctx.fillText("All collectibles found. Go to the portal.", 20, 60);
  }
}

function drawWinMessage() {
  if (gameWon) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillRect(180, 230, 440, 100);

    ctx.fillStyle = "#9a6f88";
    ctx.font = "36px Arial";
    ctx.fillText("You escaped", 300, 290);
  }
}

function drawBackground() {
  ctx.fillStyle = "#eaf5ee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawAll() {
  drawBackground();

  for (let obstacle of obstacles) {
    obstacle.draw();
  }

  for (let item of collectibles) {
    item.draw();
  }

  drawExitPortal();
  player.draw();
  drawScore();
  drawInstructions();
  drawWinMessage();
}

function update() {
  player.move();
  checkCollectibles();
  checkWin();
  drawAll();
}

async function loadGameData() {
  let obstacleResponse = await fetch("obstacles.json");
  let obstacleData = await obstacleResponse.json();

  for (let data of obstacleData) {
    obstacles.push(
      new Obstacle(data.x, data.y, data.width, data.height, data.color)
    );
  }

  let collectibleResponse = await fetch("collectibles.json");
  let collectibleData = await collectibleResponse.json();

  for (let data of collectibleData) {
    collectibles.push(
      new Collectible(data.x, data.y, data.width, data.height, data.color)
    );
  }

  setInterval(update, 1000 / 60);
}

loadGameData();

loadGameData();
