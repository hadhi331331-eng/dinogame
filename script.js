const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const jumpSound = document.getElementById("jumpSound");
const hitSound = document.getElementById("hitSound");
const gameOverScreen = document.getElementById("gameOver");
const scoreText = document.getElementById("score");
const game = document.querySelector(".game");

/* ---------- GAME STATE ---------- */
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameRunning = true;
let started = false;

/* ---------- PHYSICS ---------- */
let velocityY = 0;
const gravity = 0.6;
const jumpForce = -10;
const groundY = 150; // must match CSS

/* ---------- SPEED ---------- */
const START_SPEED = 0.9; // faster starting speed
let speed = START_SPEED;

/* ---------- JUMP ---------- */
function jump() {
  if (!gameRunning) return;

  if (dino.offsetTop >= groundY) {
    velocityY = jumpForce;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

/* ---------- MAIN LOOP ---------- */
function gameLoop() {
  if (!gameRunning) return;

  /* Dino physics */
  velocityY += gravity;
  let newTop = dino.offsetTop + velocityY;

  if (newTop >= groundY) {
    newTop = groundY;
    velocityY = 0;
  }

  dino.style.top = newTop + "px";

  /* Move cactus */
  let cactusLeft = cactus.offsetLeft - speed * 6;
  cactus.style.left = cactusLeft + "px";

  if (cactusLeft < -20) {
    cactus.style.left = 600 + Math.random() * 200 + "px"; // random offset
  }

  /* Collision detection */
  if (
    cactus.offsetLeft < 80 &&
    cactus.offsetLeft > 0 &&
    dino.offsetTop >= groundY - 10
  ) {
    endGame();
  }

  /* Score & speed */
  score++;
  scoreText.innerText = `Score: ${score} | High: ${highScore}`;

  // smoother speed increase
  speed += 0.0003;

  /* Night mode */
  if (score > 500) {
    game.style.background = "#222";
    game.style.borderColor = "#fff";
    scoreText.style.color = "#fff";
  }

  requestAnimationFrame(gameLoop);
}

/* ---------- GAME OVER ---------- */
function endGame() {
  if (!gameRunning) return;

  hitSound.currentTime = 0;
  hitSound.play();

  gameRunning = false;
  gameOverScreen.style.display = "block";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
}

/* ---------- RESTART ---------- */
function restartGame() {
  score = 0;
  speed = START_SPEED;
  velocityY = 0;
  gameRunning = true;
  started = true;

  cactus.style.left = "600px";

  game.style.background = "#fff";
  game.style.borderColor = "#000";
  scoreText.style.color = "#000";

  gameOverScreen.style.display = "none";

  requestAnimationFrame(gameLoop);
}

/* ---------- CONTROLS ---------- */
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (!started) {
      started = true;
      requestAnimationFrame(gameLoop);
    }

    jump();
  }
});

document.addEventListener("touchstart", () => {
  if (!started) {
    started = true;
    requestAnimationFrame(gameLoop);
  }
  jump();
});