const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const storage = require('electron-json-storage');

//INSTRUCTIONS WINDOW
function createInstructionsWindow() {
    const instructionsWin = new BrowserWindow({
        height: 599,
        width: 587,
        resizable: false,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true // Required for IPC
        }
    });

    instructionsWin.loadFile('instructions.html');
    instructionsWin.setMenuBarVisibility(false);
    instructionsWin.setAutoHideMenuBar(true);

    // Listen for the 'open-game' event from the renderer process
    ipcMain.on('open-game', () => {
        instructionsWin.close();
        createWindow();
    });
}

app.whenReady().then(createInstructionsWindow);

//MAIN WINDOW
function createWindow() {
    const win = new BrowserWindow({
        width: 750,
        height: 840,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    win.loadFile('game.html');
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createInstructionsWindow();
    }
});

ipcMain.handle("show-message-box", async (_, { title, message, buttons }) => {
    const response = await dialog.showMessageBox({
        type: "info",
        buttons: buttons || ["OK"],  // Default button is "OK" if no buttons are passed
        title: title || "Information", // Default title if no title is passed
        message: message,
    });
    
    return response; // Optionally, return a response if you need to handle button clicks or results in the renderer
});
ipcMain.handle("save-settings", async (_, settings) => {
    return new Promise((resolve, reject) => {
        storage.set('settings', settings, (error) => {
            if (error) reject(error);
            resolve();
        });
    });
});

ipcMain.handle("load-settings", async () => {
    return new Promise((resolve, reject) => {
        storage.get('settings', (error, data) => {
            if (error) reject(error);
            resolve(data);
        });
    });
});