//const { app, BrowserWindow} = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

//let mainWindow;

function createWindow() {
    const win = new BrowserWindow({
        width: 750,
        height: 840,
        webPreferences: {
            preload: `${__dirname}/preload.js`,
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');
}


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(createWindow);


ipcMain.handle("show-message-box", async (_, { title, message, buttons }) => {
    const response = await dialog.showMessageBox({
        type: "info",
        buttons: buttons || ["OK"],  // Default button is "OK" if no buttons are passed
        title: title || "Information", // Default title if no title is passed
        message: message,
    });
    
    return response; // Optionally, return a response if you need to handle button clicks or results in the renderer
});
// Handle requests from renderer to open dialog
/*ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
});

ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
    const result = await dialog.showMessageBox(mainWindow, options);
    return result;
});

ipcMain.on('show-error-box', (event, { title, content }) => {
    dialog.showErrorBox(title, content);
});*/