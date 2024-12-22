const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    showMessageBox: (message) => {
        return ipcRenderer.invoke("show-message-box", message);
    },
    openGame: () => {
        ipcRenderer.send("open-game");
    },
    saveSettings: (settings) => {
        return ipcRenderer.invoke("save-settings", settings);
    },
    loadSettings: () => {
        return ipcRenderer.invoke("load-settings");
    }
});