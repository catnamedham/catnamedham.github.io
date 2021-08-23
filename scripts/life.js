function get2DArray(rows, cols, func) {
  const board = Array(rows);
  for (let row = 0; row < rows; row++) {
    board[row] = Array(cols);
    for (let col = 0; col < cols; col++) {
      board[row][col] = func();
    }
  }
  return board;
}

function deepCopy2D(array) {
  copy = new Array(array.length);
  for (let row = 0; row < array.length; row++) {
    copy[row] = array[row].slice(0);
  }
  return copy;
}

const deltas = [
  {dr: -1, dc: 0}, // delta row, delta col
  {dr: -1, dc: 1},
  {dr: 0, dc: 1},
  {dr: 1, dc: 1},
  {dr: 1, dc: 0},
  {dr: 1, dc: -1},
  {dr: 0, dc: -1},
  {dr: -1, dc: -1},
]

// counts the number of live neighbor cells
function countNeighbors(board, row, col) {
  let neighbors = 0;
  deltas.forEach(element => {
    const nr = row + element.dr; // nr -> neighbor row
    const nc = col + element.dc; // nc -> neighbor col
    let neighbor = board.at(nr);
    if (nr >= 0 && nc >= 0 && neighbor != undefined) {
      if (neighbor.at(nc) === true) {
        neighbors += 1;
      }
    }
  });
  return neighbors;
}

// true -> 2 or 3 neighbors -> true
// false -> 3 neighbors -> true
// returns the next state of the given cell
function nextState(board, row, col) {
  let neighborCount = countNeighbors(board, row, col);
  if ((board[row][col] === true && (neighborCount === 2 || neighborCount === 3)) ||
      (board[row][col] === false && neighborCount === 3)) {
    return true;
  } else {
    return false;
  }
}

function compareEquality2D(array1, array2) {
  for (let row = 0; row < array1.length; row++) {
    for (let col = 0; col < array1[0].length; col++) {
      if (array1[row][col] != array2[row][col]) {
        return false;
      }
    }
  }
  return true;
}

class LifeState {
  constructor(rows, cols, defaultCell) {
    this.rows = rows;
    this.cols = cols;
    this.defaultCell = defaultCell;
    this.board = get2DArray(rows, cols, defaultCell);
    this.lastBoard = deepCopy2D(this.board);
    this.generation = 0;
    this.running = true;
  }

  checkHalted() {
    if (this.generation % 2 === 0 && this.generation != 0) {
      if (compareEquality2D(this.board, this.lastBoard) === true) {
        this.running = false;
      } else {
        this.lastBoard = deepCopy2D(this.board);
      }
    }
  }

  update() {
    this.checkHalted();
    
    const nextBoard = get2DArray(this.rows, this.cols, () => false);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (nextState(this.board, row, col) === true) {
          nextBoard[row][col] = true;
        }
      }
    }
    this.board = nextBoard;
    this.generation++;
  }

  reset() {
    this.generation = 0;
    this.board = get2DArray(this.rows, this.cols, this.defaultCell);
    this.lastBoard = deepCopy2D(this.board);
    this.running = true;
  }
}

let resolution = 25; // changes the size of each cell
rows = Math.floor(window.innerHeight / resolution);
cols = Math.floor(window.innerWidth / resolution);
let lifeState = new LifeState(rows, cols, () => Boolean(Math.floor(Math.random() * 2)));



function setUp() {
  window.cancelAnimationFrame(reqID);
  lifeState.reset();
  window.requestAnimationFrame(draw);
}

let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
let reqID;

let frames = 0;
function draw() {
  if (frames === 10) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (lifeState.board[row][col] === true) {
          ctx.fillRect(col * resolution, row * resolution, resolution, resolution);
        }
      }
    }
    lifeState.update();
    if (lifeState.running === true) {
      reqID = window.requestAnimationFrame(draw);
    } else {
      window.cancelAnimationFrame(reqID);
      console.log('cancelled');
    }
    frames = 0;
  } else {
    frames++;
    window.requestAnimationFrame(draw);
  }
}

function printer(array) {
  let strArray = '';
  const length = array.length;
  const width = array[0].length;

  for (let y = width - 1; y >= 0; y--) {
    for (let x = 0; x < length; x++) {
      if (array[x][y] === true) {
        strArray += '#';
      } else {
        strArray += ' ';
      }
    }
    strArray += '\n';
  }
  return strArray;
}

function getGliderBoard(board) {
  board[0][26] = true;
  board[1][26] = true;
  board[2][26] = true;
  board[2][27] = true;
  board[1][28] = true;
  return board;
}

function tester() {
  let board = get2DArray(30, 30);
  board[0][26] = true;
  board[1][26] = true;
  board[2][26] = true;
  board[2][27] = true;
  board[1][28] = true;
  let game = new lifeState(30, 30);
  game.board = board;
  for (let i = 0; i < 100; i++) {
    let strBoard = printer(game.board);
    console.log(strBoard);
    console.log(game.generation);
    game.update();
  }
}

canvas.addEventListener('click', setUp);