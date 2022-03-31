let orientation = "white";
let position = "start";
var board = null;
const game = new Chess();
let $status = $("#status");
let $fen = $("#fen");
let $pgn = $("#pgn");

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;
  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}
function onDrop(source, target) {
  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });
  // illegal move
  if (move === null) return "snapback";
  updateStatus();
}
// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}
function updateStatus() {
  let status = "";
  let moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }
  // checkmate?
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  }
  // draw?
  else if (game.in_draw()) {
    status = "Game over, drawn position";
  }
  // game still on
  else {
    status = moveColor + " to move";
    // check?
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
  console.log("click");
  if (document.getElementById("pgn").classList.contains("display-none")) {
    document.getElementById("pgn").classList.remove("display-none");
    document.getElementById("pgnToggle").innerText = "Show pgn";
  } else {
    document.getElementById("pgn").classList.add("display-none");
    document.getElementById("pgnToggle").innerText = "Hide pgn";
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
