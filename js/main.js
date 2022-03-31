let orientation = "white";
let position = "start";
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
}
const loadGameBtn = document.getElementById("loadGame");
const fenForm = document.getElementById("fenForm");
loadGameBtn.onclick = () => {
  document.getElementById("top-buttons").classList.add("display-none");
  fenForm.classList.remove("display-none");
  fenForm.classList.add("fenForm");
  const fenInput = document.getElementById("fen_input");
  fenInput.focus();
  fenInput.onblur = () => {
    document.getElementById("top-buttons").classList.remove("display-none");
    fenForm.classList.add("display-none");
    fenForm.classList.remove("fenForm");
  };
  fenForm.onsubmit = (e) => {
    e.preventDefault();
    const fenInput = e.target.fen_input.value;
    loadGame(fenInput);
    fenForm.reset();
    document.getElementById("top-buttons").classList.remove("display-none");
    fenForm.classList.add("display-none");
    fenForm.classList.remove("fenForm");
  };
};
var config = {
  draggable: true,
  position: position,
  orientation: orientation,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: "./lib/img/chesspieces/wikipedia/{piece}.png",
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
board = Chessboard("myBoard", config);
updateStatus();
$("#flipOrientationBtn").on("click", board.flip);
$("#setStartBtn").on("click", gameReset);
$("#pgn").on("click", copyPgn);
$("#copyFenString").on("click", copyFen);
$("#pgnToggle").on("click", pgnToggle);
$(window).resize(board.resize);
