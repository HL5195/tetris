//Getting the canvas
const board = document.getElementById("board");
//Something similar to java graphics
const draw = board.getContext("2d");

const scale = 30;

//scale 1:30
draw.scale(scale, scale);


const BOARD_WIDTH = board.width/scale;
const BOARD_HEIGHT = board.height/scale;

//Array to hold blocks that have landed
let landedBlocks = [];

//Object array that holds objects each contains a 
//2d array of shape of block and color
const TETROMINOES = {
  I: { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: 'cyan' },
  J: { shape: [[1,0,0],[1,1,1],[0,0,0]], color: 'blue' },
  L: { shape: [[0,0,1],[1,1,1],[0,0,0]], color: 'orange' },
  O: { shape: [[1,1],[1,1]], color: 'yellow' },
  S: { shape: [[0,1,1],[1,1,0],[0,0,0]], color: 'lime' },
  T: { shape: [[0,1,0],[1,1,1],[0,0,0]], color: 'purple' },
  Z: { shape: [[1,1,0],[0,1,1],[0,0,0]], color: 'red' }
};

//Pick a random block usinG Math random
function pickBlock() {
  const keys = Object.keys(TETROMINOES);
  return TETROMINOES[keys[Math.floor(Math.random() * keys.length)]];
}

//Draw a single pixel on screen using x,y,color
function drawPixel(x, y, color) {
  draw.fillStyle = color;
  draw.fillRect(x, y, 1, 1);
}

 //Calls pickBlock then gets the length of the block and finds where to
 //"spawn" it somewhere on the top
function spawnBlock() {
  const block = pickBlock();
  const shapeWidth = block.shape[0].length;
  //Width - shapeWidth to prevent spawning off the canvas
  const randomX = Math.floor(Math.random() * (BOARD_WIDTH - shapeWidth + 1));

  //returning the block that was spawned by saving the shape,color and postition
  return {
    shape: block.shape,
    color: block.color,
    position: { x: randomX, y: 0 }
  };
}

//Storing the current block
let currentBlock = spawnBlock();

//Drawing each pixel based on the 2d array provided by the block
//Only drawing a pixel when there is a 1
function drawBlock(block) {
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x] === 1) {
        drawPixel(x + block.position.x, y + block.position.y, block.color);
      }
    }
  }
}

function isWithinBorders(block) {
  for (let y = 0; y < block.shape.length; y++) {
    for (let x = 0; x < block.shape[y].length; x++) {
      if (block.shape[y][x] === 1) {
        const newX = block.position.x + x;
        const newY = block.position.y + y;

        // Check for going out of board bounds
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // Check for collision with any landed block
        for (const landed of landedBlocks) {
          for (let ly = 0; ly < landed.shape.length; ly++) {
            for (let lx = 0; lx < landed.shape[ly].length; lx++) {
              if (
                landed.shape[ly][lx] === 1 &&
                landed.position.x + lx === newX &&
                landed.position.y + ly === newY
              ) {
                return false; // Collision detected
              }
            }
          }
        }
      }
    }
  }
  return true; // All checks passed
}


function update() {
  // Clear the canvas
  draw.clearRect(0, 0, board.width, board.height);

  // Draw all blocks that have already landed
  for (const block of landedBlocks) {
    drawBlock(block);
  }

  // Simulate the block falling down 1 full row (not 0.25 for now)
  const testBlock = {
    shape: currentBlock.shape,
    color: currentBlock.color,
    position: {
      x: currentBlock.position.x,
      y: currentBlock.position.y + 1 // full unit per tick
    }
  };

  // If the block can move down, apply the move
  if (isWithinBorders(testBlock)) {
    currentBlock.position.y += .25;
  } else {
    // Block cannot move down → lock it in place
    currentBlock.position.y = Math.floor(currentBlock.position.y);
    landedBlocks.push(currentBlock);

    // Spawn a new block
    currentBlock = spawnBlock();

    // If the new block is immediately invalid → Game Over
    if (!isWithinBorders(currentBlock)) {
      alert("Game Over!");
      landedBlocks = []; // Clear the board
    }
  }

  // Draw the falling block
  drawBlock(currentBlock);
}




document.addEventListener("keydown", function(e) {
  const tempPosition = { ...currentBlock.position };

  if (e.key === "ArrowLeft") tempPosition.x -= 1;
  if (e.key === "ArrowRight") tempPosition.x += 1;
  if (e.key === "ArrowDown") tempPosition.y += 1;

  const testBlock = {
    shape: currentBlock.shape,
    color: currentBlock.color,
    position: tempPosition
  };

  if (isWithinBorders(testBlock)) {
    currentBlock.position = tempPosition;
  }
});

setInterval(update, 30);
