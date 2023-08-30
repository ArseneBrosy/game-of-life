var canvas = document.getElementById("renderer");
var ctx = canvas.getContext("2d");

//region CONSTANTES
const CELLSIZE = 30;
const PLAYGROUND_WIDTH = 100;
const PLAYGROUND_HEIGHT = 100;
const GEN_TIME = 50;

// couleures
const c_background = "black";
const c_grid = "white";
const c_cells = ["transparent", "white", "blue"];
//endregion

//region VARIABLES
var camX = 0;
var camY = 0;

// souris
var mouseX = 0;
var mouseY = 0;
var mouseLeft = false;
var mouseCamOffsetX = 0;
var mouseCamOffsetY = 0;

// cellules
var cells = [];
var newCells = [];
for (var y = 0; y < PLAYGROUND_HEIGHT; y++) {
    var newRow = [];
    for (var x = 0; x < PLAYGROUND_WIDTH; x++) {
        newRow.push(0);
    }
    cells.push(newRow);
}

let gameRunning = false;

/*
//GLIDER
cells[2][0] = 1;
cells[0][1] = 1;
cells[1][2] = 1;
cells[2][1] = 1;
cells[2][2] = 1;
*/

//GLIDER GUN
cells[1][5] = 1;
cells[1][6] = 1;
cells[2][5] = 1;
cells[2][6] = 1;

cells[13][3] = 1;
cells[14][3] = 1;
cells[12][4] = 1;
cells[11][5] = 1;
cells[11][6] = 1;
cells[11][7] = 1;
cells[12][8] = 1;
cells[13][9] = 1;
cells[14][9] = 1;

cells[15][6] = 1;

cells[16][4] = 1;
cells[17][5] = 1;
cells[17][6] = 1;
cells[18][6] = 1;
cells[17][7] = 1;
cells[16][8] = 1;

cells[21][3] = 1;
cells[21][4] = 1;
cells[21][5] = 1;
cells[22][3] = 1;
cells[22][4] = 1;
cells[22][5] = 1;

cells[23][2] = 1;
cells[23][6] = 1;

cells[25][1] = 1;
cells[25][2] = 1;
cells[25][6] = 1;
cells[25][7] = 1;

cells[35][3] = 1;
cells[35][4] = 1;
cells[36][3] = 1;
cells[36][4] = 1;
//endregion

function neighbours(x, y, cell = 1) {
    var count = 0;
    var xMin = -1;
    var xMax = 1;
    var yMin = -1;
    var yMax = 1;
    if (x <= 0) {
        xMin = 0;
    }
    if (x >= PLAYGROUND_WIDTH -1 ) {
        xMax = 0;
    }
    if (y <= 0) {
        yMin = 0;
    }
    if (y >= PLAYGROUND_HEIGHT -1 ) {
        yMax = 0;
    }
    for (var offY = yMin; offY <= yMax; offY ++) {
        for (var offX = xMin; offX <= xMax; offX ++) {
            if (cells[x + offX][y + offY] === cell && !(offX === 0 && offY === 0)) {
                count ++;
            }
        }
    }
    return count;
}

function nextTurn() {
    // creation du futur terrain
    newCells = [];
    for (var y = 0; y < PLAYGROUND_HEIGHT; y++) {
        var newRow = [];
        for (var x = 0; x < PLAYGROUND_WIDTH; x++) {
            newRow.push(0);
        }
        newCells.push(newRow);
    }
    // analyse de l'actuel terrain
    for (var y = 0; y < PLAYGROUND_HEIGHT; y++) {
        for (var x = 0; x < PLAYGROUND_WIDTH; x++) {
            // morte
            if (cells[x][y] === 0) {
                // naissance
                if (neighbours(x, y) === 3) {
                    newCells[x][y] = 1;
                }
            }
            // vivante
            if (cells[x][y] === 1) {
                newCells[x][y] = 1;
                // mort
                if (neighbours(x, y) < 2 || neighbours(x, y) > 3) {
                    newCells[x][y] = 0;
                }
            }
        }
    }
    // deploiement du futur terrain
    cells = newCells;
}

function loop() {
    if(mouseLeft) {
        camX = mouseX + mouseCamOffsetX;
        camY = mouseY + mouseCamOffsetY;
    }
    if (camX < -(PLAYGROUND_WIDTH * CELLSIZE - canvas.width)) { camX = -(PLAYGROUND_WIDTH * CELLSIZE - canvas.width); }
    if (camY < -(PLAYGROUND_HEIGHT * CELLSIZE - canvas.height)) { camY = -(PLAYGROUND_HEIGHT * CELLSIZE - canvas.height); }
    if (camX > 0) { camX = 0; }
    if (camY > 0) { camY = 0; }

    //#region AFFICHAGE
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //#region FOND
    ctx.fillStyle = c_background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //#endregion

    //#region CELLULES
    for (var y = 0; y < PLAYGROUND_HEIGHT; y++) {
        for (var x = 0; x < PLAYGROUND_WIDTH; x++) {
            ctx.fillStyle = c_cells[cells[x][y]];
            ctx.fillRect(camX + x * CELLSIZE, camY + y * CELLSIZE, CELLSIZE, CELLSIZE);
        }
    }
    //#endregion

    //#region GRILLE
    ctx.fillStyle = c_grid;
    // vertical
    for (var x = camX; x < camX + PLAYGROUND_WIDTH * CELLSIZE; x += CELLSIZE) {
        ctx.fillRect(x - 1, camY, 2, PLAYGROUND_HEIGHT * CELLSIZE);
    }
    // horizontal
    for (var y = camY; y < camY + PLAYGROUND_HEIGHT * CELLSIZE; y += CELLSIZE) {
        ctx.fillRect(camX, y - 1, PLAYGROUND_WIDTH * CELLSIZE, 2);
    }
    //#endregion
    //#endregion
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

let generations;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
document.addEventListener("mousedown", (e) => {
    if (e.which === 1) {
        mouseLeft = true;
        mouseCamOffsetX = camX - mouseX;
        mouseCamOffsetY = camY - mouseY;
    }
});
document.addEventListener("mouseup", (e) => {
    if (e.which === 1) {
        mouseLeft = false;
    }
});

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        gameRunning = !gameRunning;
        if (gameRunning) {
            generations = setInterval(nextTurn, GEN_TIME);
        } else {
            clearInterval(generations);
        }
    }
    if (e.code === "ArrowRight") {
        requestAnimationFrame(nextTurn);
    }
});