
const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const statusElement = document.getElementById("status");

let board;
let score;
let over;

function startGame() {
  board = Array(16).fill(0);
  score = 0;
  over = false;
  statusElement.textContent = "Use arrow keys to play";
  addTile();
  addTile();
  render();
}

function addTile() {
  const empty = board
    .map((value, index) => value === 0 ? index : -1)
    .filter(index => index !== -1);

  if (!empty.length) return;

  const index = empty[Math.floor(Math.random() * empty.length)];
  board[index] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  boardElement.innerHTML = "";

  board.forEach(value => {
    const cell = document.createElement("div");
    cell.className = "cell" + (value ? ` v${value}` : "");
    cell.textContent = value || "";
    boardElement.appendChild(cell);
  });

  scoreElement.textContent = score;
}

function slide(row) {
  const values = row.filter(value => value !== 0);

  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === values[i + 1]) {
      values[i] *= 2;
      score += values[i];
      values.splice(i + 1, 1);
    }
  }

  while (values.length < 4) values.push(0);
  return values;
}

function move(direction) {
  if (over) return;

  const previous = board.join(",");
  let next = board.slice();

  for (let line = 0; line < 4; line++) {
    let indexes = [];

    for (let offset = 0; offset < 4; offset++) {
      if (direction === "left" || direction === "right") {
        indexes.push(line * 4 +
          (direction === "left" ? offset : 3 - offset));
      } else {
        indexes.push(
          (direction === "up" ? offset : 3 - offset) * 4 + line
        );
      }
    }

    const result = slide(indexes.map(i => board[i]));

    indexes.forEach((index, i) => {
      next[index] = result[i];
    });
  }

  board = next;

  if (board.join(",") !== previous) {
    if (board.includes(2048)) {
      statusElement.textContent = "You reached 2048! 🎉";
    }

    addTile();
  }

  if (!canMove()) {
    over = true;
    statusElement.textContent = "Game over! Start a new game.";
  }

  render();
}

function canMove() {
  if (board.includes(0)) return true;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const i = row * 4 + col;

      if (col < 3 && board[i] === board[i + 1]) return true;
      if (row < 3 && board[i] === board[i + 4]) return true;
    }
  }

  return false;
}

document.addEventListener("keydown", event => {
  const directions = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down"
  };

  if (directions[event.key]) {
    event.preventDefault();
    move(directions[event.key]);
  }
});

let touchStartX = 0;
let touchStartY = 0;

boardElement.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

boardElement.addEventListener("touchend", event => {
  const dx = event.changedTouches[0].clientX - touchStartX;
  const dy = event.changedTouches[0].clientY - touchStartY;

  if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;

  move(Math.abs(dx) > Math.abs(dy)
    ? (dx > 0 ? "right" : "left")
    : (dy > 0 ? "down" : "up"));
}, { passive: true });

document.getElementById("restart").addEventListener("click", startGame);

startGame();

