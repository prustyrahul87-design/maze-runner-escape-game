// ==========================================
// GAME SETTINGS
// ==========================================

const ROWS = 13;
const COLS = 21;


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const maze = document.getElementById("maze");

const levelDisplay =
    document.getElementById("level");

const timerDisplay =
    document.getElementById("timer");

const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const message =
    document.getElementById("message");

const restartBtn =
    document.getElementById("restartBtn");


// ==========================================
// GAME VARIABLES
// ==========================================

let grid;

let playerRow = 1;
let playerCol = 1;

let exitRow = ROWS - 2;
let exitCol = COLS - 2;

let level = 1;

let lives = 3;

let score = 1000;

let time = 0;

let gameRunning = true;

let timer;


// ==========================================
// CREATE EMPTY MAZE
// ==========================================

function createEmptyGrid() {

    grid = [];

    for (let row = 0; row < ROWS; row++) {

        grid[row] = [];

        for (let col = 0; col < COLS; col++) {

            grid[row][col] = 1;

        }
    }
}


// ==========================================
// MAZE GENERATION
// DFS - DEPTH FIRST SEARCH
// ==========================================

function generateMaze() {

    createEmptyGrid();


    function carve(row, col) {

        grid[row][col] = 0;


        let directions = [

            [-2, 0],

            [2, 0],

            [0, -2],

            [0, 2]

        ];


        // Randomize directions

        directions.sort(
            () => Math.random() - 0.5
        );


        for (let direction of directions) {

            const newRow =
                row + direction[0];

            const newCol =
                col + direction[1];


            // Check boundaries

            if (
                newRow > 0 &&
                newRow < ROWS - 1 &&
                newCol > 0 &&
                newCol < COLS - 1 &&
                grid[newRow][newCol] === 1
            ) {

                // Remove wall between cells

                grid[
                    row + direction[0] / 2
                ][
                    col + direction[1] / 2
                ] = 0;


                carve(
                    newRow,
                    newCol
                );
            }
        }
    }


    // Start generating maze

    carve(1, 1);


    // Make sure exit is open

    grid[exitRow][exitCol] = 0;
}


// ==========================================
// DRAW MAZE
// ==========================================

function drawMaze() {

    maze.innerHTML = "";


    for (let row = 0; row < ROWS; row++) {

        for (let col = 0; col < COLS; col++) {

            const cell =
                document.createElement("div");


            cell.classList.add("cell");


            // Wall

            if (grid[row][col] === 1) {

                cell.classList.add("wall");

            }

            // Path

            else {

                cell.classList.add("path");
            }


            // Player

            if (
                row === playerRow &&
                col === playerCol
            ) {

                cell.classList.add("player");

                cell.textContent = "🧍";
            }


            // Exit

            if (
                row === exitRow &&
                col === exitCol
            ) {

                cell.classList.add("exit");

                cell.textContent = "🏁";
            }


            maze.appendChild(cell);
        }
    }
}


// ==========================================
// PLAYER MOVEMENT
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {
            return;
        }


        let newRow =
            playerRow;

        let newCol =
            playerCol;


        // UP

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {

            newRow--;
        }


        // DOWN

        else if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {

            newRow++;
        }


        // LEFT

        else if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            newCol--;
        }


        // RIGHT

        else if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            newCol++;
        }


        else {

            return;
        }


        // Stop arrow-key page scrolling

        event.preventDefault();


        // ======================================
        // WALL COLLISION
        // ======================================

        if (
            grid[newRow] === undefined ||
            grid[newRow][newCol] === undefined
        ) {

            return;
        }


        if (
            grid[newRow][newCol] === 1
        ) {

            loseLife();

            return;
        }


        // ======================================
        // MOVE PLAYER
        // ======================================

        playerRow = newRow;

        playerCol = newCol;


        drawMaze();


        // ======================================
        // CHECK EXIT
        // ======================================

        if (
            playerRow === exitRow &&
            playerCol === exitCol
        ) {

            levelComplete();
        }

    }
);


// ==========================================
// LOSE LIFE
// ==========================================

function loseLife() {

    lives--;


    updateLives();


    message.textContent =
        "💥 You hit a wall!";


    // Reset player position

    playerRow = 1;

    playerCol = 1;


    drawMaze();


    // Game over

    if (lives <= 0) {

        gameRunning = false;

        clearInterval(timer);

        message.textContent =
            "💀 Game Over! Click Restart.";

        return;
    }
}


// ==========================================
// UPDATE LIVES
// ==========================================

function updateLives() {

    livesDisplay.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(3 - lives);
}


// ==========================================
// LEVEL COMPLETE
// ==========================================

function levelComplete() {

    gameRunning = false;


    // Bonus points

    score += 500;


    scoreDisplay.textContent =
        score;


    message.textContent =
        "🎉 Level " +
        level +
        " Complete!";


    setTimeout(function() {

        level++;


        levelDisplay.textContent =
            level;


        // Reset player

        playerRow = 1;

        playerCol = 1;


        // Generate new maze

        generateMaze();


        drawMaze();


        message.textContent =
            "🚀 Level " +
            level +
            " — Find the exit!";


        gameRunning = true;

    }, 1500);
}


// ==========================================
// TIMER
// ==========================================

timer = setInterval(function() {

    if (!gameRunning) {

        return;
    }


    time++;


    timerDisplay.textContent =
        time;


    // Reduce score slowly

    score -= 2;


    if (score < 0) {

        score = 0;
    }


    scoreDisplay.textContent =
        score;

}, 1000);


// ==========================================
// RESTART GAME
// ==========================================

restartBtn.addEventListener(
    "click",
    restartGame
);


function restartGame() {

    level = 1;

    lives = 3;

    score = 1000;

    time = 0;

    playerRow = 1;

    playerCol = 1;

    gameRunning = true;


    levelDisplay.textContent =
        level;

    timerDisplay.textContent =
        time;

    scoreDisplay.textContent =
        score;


    updateLives();


    message.textContent =
        "Find the 🏁 and escape!";


    // Generate fresh maze

    generateMaze();


    drawMaze();
}


// ==========================================
// START GAME
// ==========================================

restartGame();