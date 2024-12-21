const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    showMessageBox: (message) => {
        return ipcRenderer.invoke("show-message-box", message);
    },
    openGame: () => {
        ipcRenderer.send("open-game");
    }
});