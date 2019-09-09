// Define global variables
// Keep count whos turn it is
let turn = "X";
// Is game ended?
let ended = false;
// Set how big gamefield should be at the beginning.
let initial_size = 6;
// Tics and toes in simple two dimensional array
let tics_and_toes = new Array(6);

function init() {
  // Generate two dimensional array by putting lists inside lists
  for (let x = 0; x < 6; x++) {
    tics_and_toes[x] = new Array(6);
    initialize_array(tics_and_toes[x], "");
  }
  // Render initial table
  render_table(tics_and_toes);
}

function update_table(tics_and_toes, x_start, y_start) {
  // If the last tick or toe came closer than three spaces to edge
  // Generate more space to that side
  let x_size = tics_and_toes.length;
  let y_size = tics_and_toes[0].length;
  let limit = 3;
  let more = 0;
  // Generate space left
  if (x_start < limit) {
    more = limit - x_start
    for (let x = 0; x < more; x++) {
      tics_and_toes.unshift(new Array(y_size));
      initialize_array(tics_and_toes[0], "");
    }
  }
  // Generate space right
  if (x_size - x_start <= limit) {
    more = limit - (x_size - x_start) + 1
    for (let x = 0; x < more; x++) {
      tics_and_toes.push(new Array(y_size));
      initialize_array(tics_and_toes[x_size + x], "");
    }
  }
  // In case should be expanded to two directions
  x_size = tics_and_toes.length;
  // Generate space up
  if (y_start < limit) {
    more = limit - y_start
    for (let x = 0; x < x_size; x++) {
      for (let y = 0; y < more; y++) {
        tics_and_toes[x].unshift("");
      }
    }
  }
  // Generate space down
  if (y_size - y_start <= limit) {
    more = limit - (y_size - y_start) + 1
    for (let x = 0; x < x_size; x++) {
      for (let y = 0; y < more; y++) {
        tics_and_toes[x].push("");
      }
    }
  }
}

function initialize_array(array, mark){
  for (let index = 0; index < array.length; index++) {
    array[index] = mark;
  }
}

function render_table(tics_and_toes) {
  let board = document.getElementById("board");
  // Clear board
  board.innerHTML = "";
  table = document.createElement("table");
  let x_size = tics_and_toes.length;
  let y_size = tics_and_toes[0].length;
  for (let y = 0; y < y_size; y++) {
    // Create rows
    let row = document.createElement("tr");
    for (let x = 0; x < x_size; x++) {
      // Create columns for rows
      let column = document.createElement("td");
      // Add id for click element usage
      column.dataset.coord_x = x;
      column.dataset.coord_y = y;
      // Add click handeler
      column.addEventListener("click", click_event);
      // Write tic or toe based on the two dimensional array
      column.innerHTML = tics_and_toes[x][y];
      // Add column to row
      row.appendChild(column);
    }
    // Add row to table
    table.appendChild(row);
  }
  // Show table
  board.appendChild(table);
}

function click_event() {
  // Check has the game ended allready
  if (ended === true) {
    return;
  }
  // Get cell coordinates from the dataset
  let x = Number(this.dataset.coord_x);
  let y = Number(this.dataset.coord_y);
  if (tics_and_toes[x][y] === "") {
    // Update cell if there is no marking allredy
    tics_and_toes[x][y] = turn;
    update_player_status();
  }
  // Calculate straight count
  // This gotta be done before updates otherwise
  // function will check wrong position
  results = check_status(tics_and_toes, x, y);
  let mark = tics_and_toes[x][y];
  // Update table incase there is need for new space
  update_table(tics_and_toes, x, y);
  // Render new table
  render_table(tics_and_toes);
  // Check wether either player won the game
  check_winner(results, mark)
}

function update_player_status() {
  // Update whos turn text field
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

function check_status(tics_and_toes, x, y) {
  // Check winner from x and y position
  // Define variables
  let count = 5;
  let first;
  let second;
  let results = new Array(4);
  // Chek left and right
  first = check_lines(tics_and_toes, x, y, 1, 0, count);
  second = check_lines(tics_and_toes, x, y, -1, 0, count);
  results[0] = first + second -1;
  // Chek up and down
  first = check_lines(tics_and_toes, x, y, 0, 1, count);
  second = check_lines(tics_and_toes, x, y, 0, -1, count);
  results[1] = first + second -1;
  // Check left down right up
  first = check_lines(tics_and_toes, x, y, 1, 1, count);
  second = check_lines(tics_and_toes, x, y, -1, -1, count);
  results[2] = first + second -1;
  // Check left up right down
  first = check_lines(tics_and_toes, x, y, 1, -1, count);
  second = check_lines(tics_and_toes, x, y, -1, 1, count);
  results[3] = first + second -1;
  return results;
}
					
	
function check_lines(
  tics_and_toes,
  start_x,
  start_y,
  direction_x,
  direction_y,
  max_length
) {
  // Check lines using basic analytical math
  // Return line lenght
  let mark = tics_and_toes[start_x][start_y];
  let x_size = tics_and_toes.length;
  let y_size = tics_and_toes[0].length;
  let x;
  let y;
  let count
  for (count = 1; count < max_length; count++) {
    x = start_x + direction_x * count;
    y = start_y + direction_y * count;
    // Check have we reatched edge
    if (x < 0 || x >= x_size) {
      break;
    }
    if (y < 0 || y >= y_size) {
      break;
    }
    if (tics_and_toes[x][y] !== mark) {
      // If found different mark break and return length
      break;
    }
  }
  return count;
}

function check_winner(results, mark) {
  // Check do we have a winner
  if (results.includes(5)) {
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
