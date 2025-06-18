const { app, BrowserWindow, ipcMain } = require("electron");

const fs = require("fs");
const path = require("path");

function createWindow() {
  const window = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, "assets", "desktopIcon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    window.loadURL("http://localhost:5173");
  } else {
    window.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("create-queue-item", (event, queueData) => {
  console.log(queueData);
});
