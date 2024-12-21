let tries = 0;
let rabbitCell;
let rabbitCellId;
let difficulty = 3; //lower -> harder
let currentArrows = [];
let slider = document.getElementById("slider");
let dropdown = document.getElementById("difficultyDropdown");
let rowsNum = parseInt(slider.value);
let endGame = false;
let topWall = [];
let leftWall = [];
let rightWall = [];
let bottomWall = [];

startGame();

slider.addEventListener("input", (event) => {
    rowsNum = parseInt(event.target.value);
    refreshGame();
});

dropdown.addEventListener("change", (event) => {
    changeDifficulty(event);
    refreshGame();
});

function startGame() {
    console.log("startGame called");
    tries = 0;
    document.getElementById("tries").innerHTML = `Tries: ${tries}`;
    createCells();
    paintCells();
    startCells();
    initWalls();
}

function refreshGame() {
    tries = 0;
    document.getElementById("tries").innerHTML = `Tries: ${tries}`;
    clearEventListeners();
    clearWalls();
    currentArrows = [];
    createCells();
    paintCells();
    startCells();
    initWalls();
}

function clearEventListeners() {
    for (let i = 0; i < rowsNum * rowsNum; i++) {
        let td = document.getElementById(`td${i}`);
        if (td) {
            td.removeEventListener("click", normalCell);
            td.removeEventListener("click", rabbitFound);
        }
    }
       
}
 function clearWalls() {
        topWall = [];
        leftWall = [];
        rightWall = [];
        bottomWall = [];
    }

//START GAME FUNCTIONS
function createCells() {
    let table = document.getElementById("table");
    let rows = "";
    let cells = 0;
    for (let i = 0; i < rowsNum; i++) {
        rows += `<tr id=tr${i}>`;
        for (let n = 0; n < rowsNum; n++) {
            rows += `<td id=td${cells}>‍‍‍ </td>`;
            cells++;
        }
        rows += `</tr>`;
    }
    table.innerHTML = rows;
}

function paintCells() {
    for (let i = 0; i < rowsNum * rowsNum; i++) {
        let td = document.getElementById(`td${i}`);
        let row = Math.floor(i / rowsNum);
        let col = i % rowsNum;
        let color = (row + col) % 2 === 0 ? "rgb(170,215,81)" : "rgb(162,209,73)";
        td.style.backgroundColor = color;
    }
}

function startCells() {
    startRabbit();
    setNormalCells();
}

function initWalls() {
    for (let i = 0; i < rowsNum * rowsNum; i++) {
        let row = Math.floor(i / rowsNum);
        let col = i % rowsNum;
        if (row === 0) topWall.push(i);
        if (col === 0) leftWall.push(i);
        if (col === rowsNum - 1) rightWall.push(i);
        if (row === rowsNum - 1) bottomWall.push(i);
    }
    console.log("topwall: " + topWall);
    console.log("leftwall: " + leftWall);
    console.log("rightwall:" + rightWall);
    console.log("bottomwall: " + bottomWall);
}

function startRabbit() {
    rabbitCellId = Math.floor(Math.random() * rowsNum * rowsNum);
    rabbitCell = document.getElementById(`td${rabbitCellId}`);
    rabbitCell.addEventListener("click", rabbitFound);
    console.log(rabbitCell);
    return rabbitCell;
}

function setNormalCells() {
    for (let i = 0; i < rowsNum * rowsNum; i++) {
        let td = document.getElementById(`td${i}`);
        if (rabbitCellId != i)
            td.addEventListener("click", normalCell);
    }
}

//LOGIC FUNCTIONS
function rabbitCellMoves() {
    let canMove = false;
    let newRabbitCellId;
    do {
        newRabbitCellId = newPosition();
        console.log(`new position ${newRabbitCellId}`);

        if (newRabbitCellId < 0 || newRabbitCellId >= (rowsNum * rowsNum) || newRabbitCellId == -1)
            continue;
        else canMove = true;
    } while (!canMove);

    if (canMove) {
        console.log("///////////////////////")
        console.log("rabbit moves")
        console.log("///////////////////////")
        rabbitCell.removeEventListener("click", rabbitFound);
        rabbitCell.addEventListener("click", normalCell);
        rabbitCell.innerHTML = "";
        rabbitCellId = newRabbitCellId;
        rabbitCell = document.getElementById(`td${newRabbitCellId}`);
        rabbitCell.removeEventListener("click", normalCell);
        rabbitCell.addEventListener("click", rabbitFound);
    }
}

function newPosition() {
    let direction = Math.floor(Math.random() * 8);
    console.log(`direction: ${direction}`);
    console.log(`current position: ${rabbitCellId}`);
    console.log(`rowsNum: ${rowsNum}`);
    switch (direction) {
        case 0:
            //↖️
            if (topWall.includes(rabbitCellId) || leftWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId - rowsNum - 1);
        case 1:
            //⬆️
            if (topWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId - rowsNum);
        case 2:
            //↗️
            if (topWall.includes(rabbitCellId) || rightWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId - rowsNum + 1);
        case 3:
            //⬅️
            if (leftWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId - 1);
        case 4:
            //➡️
            if (rightWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId + 1);
        case 5:
            //↙️
            if (leftWall.includes(rabbitCellId) || bottomWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId + rowsNum - 1);
        case 6:
            //⬇️
            if (bottomWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId + rowsNum);
        case 7:
            //↘️
            if (rightWall.includes(rabbitCellId) || bottomWall.includes(rabbitCellId))
                return -1;
            else return (rabbitCellId + rowsNum + 1);
    }
    return -1;
}

//LISTENERS
//listener rabbitFound
function rabbitFound() {
    rabbitCell.innerHTML = "🐰";
    tries++;
    document.getElementById("tries").innerHTML = `Tries: ${tries}`;
    for (let i = 0; i < rowsNum * rowsNum; i++) {
        let td = document.getElementById(`td${i}`);
        td.removeEventListener("click", normalCell);
        td.removeEventListener("click", rabbitFound);
    }
    let message = tries === 1
        ? `You found the rabbit on the first try!`
        : `You found the rabbit in ${tries} tries!`;
        
    window.electronAPI.showMessageBox({
        title: "Rabbit Found!",
        message: message,
        buttons: ["Play Again", "Exit"]
    }).then(response => {
        if (response.response === 0) {
            // User clicked "Play Again"
            startGame();
        } else {
            // User clicked "Exit"
            window.close();
        }
    });
}

//listener normalCell
function normalCell(event) {
    rabbitCellMoves();
    let td = event.currentTarget;
    let tdId = parseInt(td.id.slice(2));

    let tdTens = Math.floor(tdId / rowsNum);
    let tdUnits = tdId % rowsNum;
    let rcTens = Math.floor(rabbitCellId / rowsNum);
    let rcUnits = rabbitCellId % rowsNum;

    if (tdTens === rcTens) {
        if (tdId > rabbitCellId) td.innerHTML = "⬅️";
        else td.innerHTML = "➡️";
    }
    if (tdUnits === rcUnits) {
        if (tdId > rabbitCellId) td.innerHTML = "⬆️";
        else td.innerHTML = "⬇️";
    }
    if (tdTens > rcTens) {
        if (tdUnits > rcUnits) td.innerHTML = "↖️";
        if (tdUnits < rcUnits) td.innerHTML = "↗️";
    }
    if (tdTens < rcTens) {
        if (tdUnits < rcUnits) td.innerHTML = "↘️";
        if (tdUnits > rcUnits) td.innerHTML = "↙️";
    }

    currentArrows.push(tdId);
    tries++;
    document.getElementById("tries").innerHTML = `Tries: ${tries}`;

    if (currentArrows.length > difficulty) {
        let lastCell = document.getElementById(`td${currentArrows[0]}`);
        lastCell.innerHTML = "";
        currentArrows.shift();
    }
}

//listener changeDifficulty
function changeDifficulty(event) {
    let n = parseInt(event.target.value);
    switch (n) {
        case 1: difficulty = 15; break;
        case 2: difficulty = 10; break;
        case 3: difficulty = 5; break;
        case 4: difficulty = 3; break;
        case 5: difficulty = 1; break;
    }
    refreshGame();
}