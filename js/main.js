let orientation = "white";
let position = localStorage.getItem("position") || "start";
var board = null;
const game = new Chess();
let $status = $("#status");
let $fen = $("#fen");
let $pgn = $("#pgn");
function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}
function onDrop(source, target) {
  let move = game.move({
    from: source,
    to: target,
    promotion: "q",
  });
  if (move === null) return "snapback";
  updateStatus();
  localStorage.setItem("position", game.fen());
}
function onSnapEnd() {
  board.position(game.fen());
}
function updateStatus() {
  let status = "";
  let moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  } else if (game.in_draw()) {
    status = "Game over, drawn position";
  } else {
    status = moveColor + " to move";
    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }
  if (status === "Game over, drawn position") {
    status = "Draw";
  }
  if (status === "Game over, Black is in checkmate.") {
    status = "White Wins";
  }
  if (status === "Game over, White is in checkmate.") {
    status = "Black Wins";
  }
  $status.html(status);
  $pgn.html(game.pgn());
}
function gameReset() {
  game.reset();
  board.position(game.fen());
  updateStatus();
}
const copyPgn = () => {
  const pgn = game.pgn();
  navigator.clipboard.writeText(pgn);
};
const copyFen = () => {
  const fen = game.fen();
  navigator.clipboard.writeText(fen);
};
function loadGame(fenStr) {
  if (fenStr !== "") {
    if (game.load(fenStr)) {
      game.load(fenStr);
      board.position(fenStr);
      updateStatus();
    }
  }
  localStorage.setItem("position", game.fen());
}
const loadGameBtn = document.getElementById("loadGame");
const fenForm = document.getElementById("fenForm");
loadGameBtn.onclick = () => {
  document.getElementById("game-options").classList.add("display-none");
  fenForm.classList.remove("display-none");
  fenForm.classList.add("fenForm");
  const fenInput = document.getElementById("fen_input");
  fenInput.focus();
  document.getElementById("hideFenForm").onclick = () => {
    document.getElementById("top-buttons").classList.remove("display-none");
    fenForm.classList.add("display-none");
    fenForm.classList.remove("fenForm");
  };
  fenForm.onsubmit = (e) => {
    e.preventDefault();
    const fenInput = e.target.fen_input.value;
    loadGame(fenInput);
    fenForm.reset();
    document.getElementById("game-options").classList.remove("display-none");
    fenForm.classList.add("display-none");
    fenForm.classList.remove("fenForm");
  };
};
const pgnToggle = () => {
  if (document.getElementById("pgn").classList.contains("display-none")) {
    document.getElementById("pgn").classList.remove("display-none");
    document.getElementById("pgnToggle").innerText = "Hide pgn";
  } else {
    document.getElementById("pgn").classList.add("display-none");
    document.getElementById("pgnToggle").innerText = "Show pgn";
  }
};
document.getElementById("gameOptions").onclick = (gameOptionsBtn) => {
  const topBtns = document.getElementById("top-buttons");
  topBtns.classList.remove("display-none");
  document.getElementById("hideTopBtns").onclick = () => {
    topBtns.classList.add("display-none");
  };
};
document.getElementById("themeSel").onchange = (e) => {
  const selection = e.target.selectedIndex;
  if (selection === 0) {
    config["pieceTheme"] = "./lib/img/chesspieces/wikipedia/{piece}.png";
  }
  if (selection === 1) {
    config["pieceTheme"] = "./lib/img/chesspieces/alpha/{piece}.png";
  }
  if (selection === 2) {
    config["pieceTheme"] = "./lib/img/chesspieces/uscf/{piece}.png";
  }
};
var config = {
  draggable: true,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: "./lib/img/chesspieces/wikipedia/{piece}.png",
};
function br() {
  board.resize;
  console.log("resize");
}
document.getElementById("themeSel").selectedIndex = 0;
board = Chessboard("myBoard", config);
updateStatus();
loadGame(position);
$("#flipOrientationBtn").on("click", board.flip);
$("#setStartBtn").on("click", gameReset);
$("#setStartBtn").on("click", () => {
  localStorage.setItem("position", game.fen());
});
$("#pgn").on("click", copyPgn);
$("#copyFenString").on("click", copyFen);
$("#pgnToggle").on("click", pgnToggle);
$(window).resize(board.resize);
