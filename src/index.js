// Define global variables
// Keep count whos turn it is
let turn = "X";
// Is game ended?
let ended = false;
// Tics and toes in simple two dimensional array
let tics_and_toes = new Array(5);

function init() {
  // Generate two dimensional array by putting lists inside lists
  for (let x = 0; x < 5; x++) {
    tics_and_toes[x] = new Array(5);
    for (let y = 0; y < 5; y++) {
      tics_and_toes[x][y] = " ";
    }
  }
  // Render initial table
  render_table(tics_and_toes);
}

function render_table(tics_and_toes) {
  let board = document.getElementById("board");
  // Clear board
  board.innerHTML = "";
  let x_size = tics_and_toes.length;
  let y_size = tics_and_toes[0].length;
  for (let y = 0; y < 5; y++) {
    // Create rows
    let row = document.createElement("tr");
    for (let x = 0; x < 5; x++) {
      // Create columns for rows
      let column = document.createElement("td");
      // Add id for click element usage
      column.dataset.coord_x = x;
      column.dataset.coord_y = y;
      // Add click handeler
      column.addEventListener("click", click_event);
      // Force column to stay constant
      column.width = 100 / x_size + "%";
      column.height = 100 / y_size + "%";
      // Write tic or toe based on the two dimensional array
      column.innerHTML = tics_and_toes[x][y];
      // Add column to row
      row.appendChild(column);
    }
    // Add row to table
    board.appendChild(row);
  }
}

function click_event() {
  // Check has the game ended allready
  if (ended === true) {
    return;
  }
  // Get cell coordinates from the dataset
  let x = this.dataset.coord_x;
  let y = this.dataset.coord_y;
  if (tics_and_toes[x][y] === " ") {
    // Update cell if there is no marking allredy
    tics_and_toes[x][y] = turn;
    update_player_status();
  }
  // Render new table
  render_table(tics_and_toes);
  // Check wather either player won the game
  check_status(tics_and_toes);
}

function update_player_status() {
  player_turn = document.getElementById("player_turn");
  // Change turns
  if (turn === "X") {
    turn = "O";
    player_turn.innerHTML = "O turn";
  } else {
    turn = "X";
    player_turn.innerHTML = "X turn";
  }
}

function check_status(tics_and_toes) {
  // Check winner from every square by going to every appropriate direction
  // Define variables
  let count = 5;
  let x_size = tics_and_toes.length;
  let y_size = tics_and_toes[0].length;
  // Go column by column line by line
  for (let x = 0; x < x_size; x++) {
    for (let y = 0; y < y_size; y++) {
      if (tics_and_toes[x][y] === " ") {
        continue;
      }
      // Chek right direction
      if (x <= x_size - count) {
        check_lines(tics_and_toes, x, y, 1, 0, count);
      }
      // Chek down direction
      if (y <= y_size - count) {
        check_lines(tics_and_toes, x, y, 0, 1, count);
      }
      // Check right down
      if (x <= x_size - count && y <= y_size - count) {
        check_lines(tics_and_toes, x, y, 1, 1, count);
      }
      // Check right up
      if (x <= x_size - count && y >= y_size - 1) {
        check_lines(tics_and_toes, x, y, 1, -1, count);
      }
    }
  }
}

function check_lines(
  tics_and_toes,
  start_x,
  start_y,
  direction_x,
  direction_y,
  count
) {
  // Check lines using basic analytical math
  let mark = tics_and_toes[start_x][start_y];
  let error = 0;
  let x;
  let y;
  for (let position = 1; position < count; position++) {
    x = start_x + direction_x * position;
    y = start_y + direction_y * position;
    if (tics_and_toes[x][y] !== mark) {
      error = 1;
      break;
    }
  }
  // Handle results of the check.
  check_winner(error, mark);
}

function check_winner(error, mark) {
  // Check do we have a winner
  if (error === 0) {
    if (mark === "X") {
      alert("Player 1 won!");
    } else {
      alert("Player 2 won!");
    }
    // Add playagain button and set game to ended status
    let page = document.getElementById("layout");
    let button = document.createElement("button");
    button.innerHTML = "Play again!";
    button.setAttribute("onClick", "location.reload();");
    button.type = "button";
    page.appendChild(button);
    ended = true;
    player_turn = document.getElementById("player_turn");
    player_turn.innerHTML = ""
  }
}

init();
