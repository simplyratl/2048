import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");

let grid;
const score = document.getElementById("score");
const high_score = document.getElementById("high-score");
let resetButton;
let rewindButton;

(function defineHighScoresStorage() {
  let HIGH_SCORE;

  if (localStorage.getItem("high_score") == "null") {
    HIGH_SCORE = parseInt(localStorage.setItem("high_score", 0));
  } else {
    HIGH_SCORE = parseInt(localStorage.getItem("high_score"));
  }

  high_score.innerText = HIGH_SCORE;
})();

(function addRewind() {
  rewindButton = document.createElement("img");
  rewindButton.src = "./arrow.svg";
  rewindButton.alt = "Rewind";

  document.getElementById("rewind").append(rewindButton);
})();

(function addReset() {
  resetButton = document.createElement("img");
  resetButton.src = "./refresh.svg";
  resetButton.alt = "Refresh";

  document.getElementById("reset").append(resetButton);
})();

resetButton.addEventListener("click", resetGame);
rewindButton.addEventListener("click", rewindEvent);

resetGame();

function resetGame() {
  while (gameBoard.hasChildNodes()) {
    gameBoard.removeChild(gameBoard.firstChild);
  }

  grid = new Grid(gameBoard);

  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);

  score.innerText = 0;

  setupInput();
}

function setupInput() {
  rewind();
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose");
      if (parseInt(score.innerHTML) > parseInt(high_score.innerHTML)) {
        localStorage.setItem("high_score", parseInt(score.innerText));

        high_score.innerText = parseInt(localStorage.getItem("high_score"));
      }
    });
    return;
  }

  setupInput();
}

function rewindEvent() {
  rewind();
}

function rewind() {
  console.log(grid.rewindCell == grid.cells);
  grid.rewindCell = grid.cells;
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}
function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];

      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;

        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
            score.innerText = parseInt(score.innerText) + cell.tile.value * 2;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }

      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}