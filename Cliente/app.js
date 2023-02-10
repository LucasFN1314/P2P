const {app, BrowserWindow} = require('electron');

let win = null;
function createWindow() {
    win = new BrowserWindow({
        width: 640,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.on('ready', () => {
    createWindow();
});