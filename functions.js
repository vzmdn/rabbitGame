let slider = document.getElementById("slider");
let rowsNum = parseInt(slider.value);
let topWall = [];
let leftWall = [];
let rightWall = [];
let bottomWall = [];

let dropdown = document.getElementById("difficultyDropdown");
let difString = "medium";
let difficulty = 3; //lower -> harder
let currentArrows = [];
let tries = 0;

let rabbitCell;
let rabbitCellId;
let carrots = [];
let maxCarrots;
let eatenCarrots = 0;
let eatenCarrotsLimit = 3;

let startTime;
let endTime;

slider.addEventListener("input", (event) => {
    rowsNum = parseInt(event.target.value);
    refreshGame();
    saveSettings();
});

dropdown.addEventListener("change", (event) => {
    changeDifficulty(event);
    refreshGame();
    saveSettings();
});

window.electronAPI.loadSettings().then(settings => {
    if (settings && Object.keys(settings).length > 0) {
        rowsNum = settings.rowsNum || rowsNum;
        difficulty = settings.difficulty || difficulty;
        difString = settings.difString || difString;
        slider.value = rowsNum;
        dropdown.value = difString;
    }
    startGame();
});

function startGame() {
    console.log("new game started");
    tries = 0;
    carrots = [];
    maxCarrots = parseInt((rowsNum * rowsNum) * 0.1);
    eatenCarrots = 0;
    eatenCarrotsLimit = parseInt(Math.ceil(Math.sqrt(rowsNum)));
    createCells();
    paintCells();
    startCells();
    initWalls();
    startTime = new Date().getTime();
    console.log("maximum carrots to be eaten", maxCarrots);
    console.log("tiles", rowsNum * rowsNum);
    console.log("jump after n carrots", eatenCarrotsLimit);
}

function refreshGame() {
    clearEventListeners();
    clearWalls();
    currentArrows = [];
    maxCarrots = 0;
    eatenCarrots = 0;
    startGame();
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
            carrots.push(false);
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

function startRabbit() {
    rabbitCellId = Math.floor(Math.random() * rowsNum * rowsNum);
    rabbitCell = document.getElementById(`td${rabbitCellId}`);
    rabbitCell.addEventListener("click", rabbitFound);
    return rabbitCell;
}

function setNormalCells() {
    for (let i = 0; i < rowsNum * rowsNum; i++) {
        let td = document.getElementById(`td${i}`);
        if (rabbitCellId != i)
            td.addEventListener("click", normalCell);
    }
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
}

//REFRESH GAME FUNCTIONS
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

//LOGIC FUNCTIONS
function rabbitCellMoves() {
    let canMove = false;
    let newRabbitCellId;
    do {
        newRabbitCellId = newPosition();
        if (newRabbitCellId < 0 || newRabbitCellId >= (rowsNum * rowsNum) || newRabbitCellId == -1)
            continue;
        else canMove = true;
    } while (!canMove);

    if (canMove) {
        rabbitCell.removeEventListener("click", rabbitFound);
        rabbitCell.addEventListener("click", normalCell);
        rabbitCellId = newRabbitCellId;
        if (!carrots[rabbitCellId]) {
            carrots[rabbitCellId] = true;
            eatenCarrots++;
        };
        rabbitCell = document.getElementById(`td${newRabbitCellId}`);
        rabbitCell.removeEventListener("click", normalCell);
        rabbitCell.addEventListener("click", rabbitFound);


    }
}

function rabbitCellMovesRandom() {
    
    let newRabbitCellId = Math.floor(Math.random() * rowsNum * rowsNum);

    rabbitCell.removeEventListener("click", rabbitFound);
    rabbitCell.addEventListener("click", normalCell);
    rabbitCellId = newRabbitCellId;
    

    rabbitCell = document.getElementById(`td${newRabbitCellId}`);
    rabbitCell.removeEventListener("click", normalCell);
    rabbitCell.addEventListener("click", rabbitFound);



}

function newPosition() {
    let direction = Math.floor(Math.random() * 8);
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

function calculateScore() {
    console.log("///\nSCORE\n///");
    console.log("tries", tries);
    console.log("difficulty", difficulty);
    console.log("map tiles", rowsNum * rowsNum);
    console.log("time", endTime - startTime);

    const baseScore = 10_000;
    const time = endTime - startTime;
    const timebonus = time / 10_000; //expected time: 10 seconds
    const triesBonus = tries / 10; //expected tries: 10
    const difficultyBonus = 15 / difficulty; //max difficulty = max bonus
    const mapBonus = (rowsNum * rowsNum) / 80; //max map = max bonus

    return (baseScore / (timebonus * triesBonus)) * difficultyBonus * mapBonus;
}

function saveSettings() {
    const settings = {
        rowsNum: rowsNum,
        difficulty: difficulty,
        difString: difString
    };
    window.electronAPI.saveSettings(settings);
}

function endGame() {
    for (let i = 0; i < rowsNum * rowsNum; i++) {
        let td = document.getElementById(`td${i}`);
        if (!carrots[i]) td.innerHTML = "🥕";
        else td.innerHTML = "";
        td.removeEventListener("click", normalCell);
        td.removeEventListener("click", rabbitFound);
    }
    rabbitCell.innerHTML = "🐰";
}

//LISTENERS
//listener rabbitFound
function rabbitFound() {
    endTime = new Date().getTime();

    tries++;
    const score = parseInt(calculateScore());
    endGame();
    message = `Score ${score.toLocaleString()}`;

    window.electronAPI.showMessageBox({
        title: "Rabbit Found!",
        message: message,
        buttons: ["Play Again", "Exit"]
    }).then(response => {
        if (response.response === 0) {
            // User clicked "Play Again"
            refreshGame();
        } else {
            // User clicked "Exit"
            window.close();
        }
    });
}

//listener normalCell
function normalCell(event) {
    if (eatenCarrots >= eatenCarrotsLimit) {
        eatenCarrots = 0;
        rabbitCellMovesRandom();

    } else {
        rabbitCellMoves();
    }
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

    if (currentArrows.length > difficulty) {
        let lastCell = document.getElementById(`td${currentArrows[0]}`);
        lastCell.innerHTML = "";
        currentArrows.shift();
    }
    if (carrots.filter(value => value === true).length >= maxCarrots) {
        endGame();
        window.electronAPI.showMessageBox({
            title: "Game Over!",
            message: "Score 0\nThe rabbit ate too many carrots",
            buttons: ["Play Again", "Exit"]
        }).then(response => {
            if (response.response === 0) {
                refreshGame();
            } else {
                window.close();
            }
        });
    }
}

//listener changeDifficulty
function changeDifficulty(event) {
    difString = event.target.value;
    switch (difString) {
        case "veryEasy": difficulty = 15; break;
        case "easy": difficulty = 10; break;
        case "medium": difficulty = 5; break;
        case "hard": difficulty = 3; break;
        case "extreme": difficulty = 1; break;
    }
    refreshGame();
}