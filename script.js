const board = document.getElementById("chessboard");
let selectedSquare = null;
let currentTurn = "white";

let whiteTime = 5 * 60;
let blackTime = 5 * 60;
let whiteInterval = null;
let blackInterval = null;

const pieces = {
  white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" },
  black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" }
};

let gameBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

function drawBoard() {
  board.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square", (row + col) % 2 === 0 ? "white" : "black");
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = gameBoard[row][col];
      if (piece) {
        const span = document.createElement("span");
        span.textContent = piece;
        span.classList.add(
          Object.values(pieces.white).includes(piece) ? "white-piece" : "black-piece"
        );
        square.appendChild(span);
      }

      square.addEventListener("click", onSquareClick);
      board.appendChild(square);
    }
  }
}

function onSquareClick(e) {
  const row = parseInt(e.currentTarget.dataset.row);
  const col = parseInt(e.currentTarget.dataset.col);

  if (selectedSquare) {
    const [fromRow, fromCol] = selectedSquare;
    const piece = gameBoard[fromRow][fromCol];

    if (isValidMove(fromRow, fromCol, row, col)) {
      const target = gameBoard[row][col];
      gameBoard[fromRow][fromCol] = "";

      if ((piece === "♙" && row === 0) || (piece === "♟" && row === 7)) {
        gameBoard[row][col] = piece === "♙" ? "♕" : "♛";
      } else {
        gameBoard[row][col] = piece;
      }

      // 🔊 Play move sound
      const moveSound = document.getElementById("move-sound");
      if (moveSound) moveSound.play().catch(() => {});

      selectedSquare = null;

      if (isKingInCheck(currentTurn)) {
        alert(`${currentTurn === "white" ? "Putih" : "Hitam"} sedang skak!`);
      }

      const nextTurn = currentTurn === "white" ? "black" : "white";
      if (!hasValidMoves(nextTurn)) {
        if (isKingInCheck(nextTurn)) {
          alert(`${nextTurn === "white" ? "Putih" : "Hitam"} skakmat!`);
        } else {
          alert("Stalemate! Seri.");
        }
      }

      currentTurn = nextTurn;
      startTimer(currentTurn);
    }

    selectedSquare = null;
    drawBoard();
  } else {
    const piece = gameBoard[row][col];
    if (piece && isOwnPiece(piece)) {
      selectedSquare = [row, col];
    }
  }
}

function isOwnPiece(piece) {
  return currentTurn === "white"
    ? Object.values(pieces.white).includes(piece)
    : Object.values(pieces.black).includes(piece);
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
  const piece = gameBoard[fromRow][fromCol];
  const target = gameBoard[toRow][toCol];
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (target && isOwnPiece(target)) return false;

  if (piece === "♙" || piece === "♟") {
    const direction = piece === "♙" ? -1 : 1;
    const startRow = piece === "♙" ? 6 : 1;
    if (dx === 0 && dy === direction && !target) return true;
    if (
      dx === 0 &&
      dy === 2 * direction &&
      fromRow === startRow &&
      !gameBoard[fromRow + direction][fromCol] &&
      !target
    ) return true;
    if (absDx === 1 && dy === direction && target && !isOwnPiece(target)) return true;
    return false;
  }

  if (piece === "♘" || piece === "♞") return (absDx === 1 && absDy === 2) || (absDx === 2 && absDy === 1);
  if (piece === "♗" || piece === "♝") return absDx === absDy && isPathClear(fromRow, fromCol, toRow, toCol);
  if (piece === "♖" || piece === "♜") return (dx === 0 || dy === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
  if (piece === "♕" || piece === "♛") return (dx === 0 || dy === 0 || absDx === absDy) && isPathClear(fromRow, fromCol, toRow, toCol);
  if (piece === "♔" || piece === "♚") return absDx <= 1 && absDy <= 1;

  return false;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
  const dx = Math.sign(toCol - fromCol);
  const dy = Math.sign(toRow - fromRow);
  let r = fromRow + dy;
  let c = fromCol + dx;
  while (r !== toRow || c !== toCol) {
    if (gameBoard[r][c] !== "") return false;
    r += dy;
    c += dx;
  }
  return true;
}

function isKingInCheck(turn) {
  const kingSymbol = turn === "white" ? "♔" : "♚";
  let kingPos = null;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (gameBoard[r][c] === kingSymbol) kingPos = [r, c];

  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const piece = gameBoard[r][c];
      if (piece && (!isOwnPiece(piece))) {
        if (isValidMove(r, c, kingPos[0], kingPos[1])) return true;
      }
    }
  return false;
}

function hasValidMoves(turn) {
  for (let r1 = 0; r1 < 8; r1++) {
    for (let c1 = 0; c1 < 8; c1++) {
      const piece = gameBoard[r1][c1];
      if (piece && ((turn === "white" && Object.values(pieces.white).includes(piece)) ||
                    (turn === "black" && Object.values(pieces.black).includes(piece)))) {
        for (let r2 = 0; r2 < 8; r2++) {
          for (let c2 = 0; c2 < 8; c2++) {
            if (isValidMove(r1, c1, r2, c2)) return true;
          }
        }
      }
    }
  }
  return false;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimers() {
  document.getElementById("white-timer").textContent = "Putih: " + formatTime(whiteTime);
  document.getElementById("black-timer").textContent = "Hitam: " + formatTime(blackTime);
}

function startTimer(turn) {
  stopTimers();
  if (turn === "white") {
    whiteInterval = setInterval(() => {
      whiteTime--;
      updateTimers();
      if (whiteTime <= 0) {
        clearInterval(whiteInterval);
        alert("Waktu habis! Hitam menang!");
      }
    }, 1000);
  } else {
    blackInterval = setInterval(() => {
      blackTime--;
      updateTimers();
      if (blackTime <= 0) {
        clearInterval(blackInterval);
        alert("Waktu habis! Putih menang!");
      }
    }, 1000);
  }
}

function stopTimers() {
  clearInterval(whiteInterval);
  clearInterval(blackInterval);
}

function restartGame() {
  gameBoard = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
  ];
  currentTurn = "white";
  whiteTime = 5 * 60;
  blackTime = 5 * 60;
  stopTimers();
  updateTimers();
  startTimer(currentTurn);
  selectedSquare = null;
  drawBoard();
}

drawBoard();
updateTimers();
startTimer(currentTurn);
