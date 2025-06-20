const { app, BrowserWindow, ipcMain } = require("electron");

const fs = require("fs");
const path = require("path");

//Base Folder used to store data
const baseFolderPath = path.join(__dirname, "../python/csv-data");

// Create a window for the user
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

// deactivates when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Creates a queue Item

ipcMain.on("create-queue-item", (event, queueData) => {
  console.log(queueData);

  //Queue Data information is split up
  const { fileString, title, message, time, date, sendMode } = queueData;

  if (!fs.existsSync(baseFolderPath)) {
    fs.mkdirSync(baseFolderPath, { recursive: true });
    console.log("Created base folder:", baseFolderPath);
  }

  //creating new folders in the csv-data folder

  const folderName = title.replace(/[/\\?%*:|"<>]/g, "-");
  const targetFolder = path.join(baseFolderPath, folderName);

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
    console.log("Created folder:", targetFolder);
  }

  //create both the members.csv and the info.csv

  const membersPath = path.join(targetFolder, "members.csv");
  fs.writeFileSync(membersPath, fileString, "utf-8");
  console.log("Saved members.csv");

  const lines = fileString.split(/\r?\n/).filter((line) => line.trim() !== "");

  const membersCount = Math.max(lines.length - 1, 0);

  const sentCount = 0;
  const errorCount = 0;

  const infoPath = path.join(targetFolder, "info.csv");
  const infoContent =
    "title,message,date,time,sendMode,members,sent,error\n" + // header row
    `${title},${message},${date},${time},${sendMode},${membersCount},${sentCount},${errorCount}\n`;

  fs.writeFileSync(infoPath, infoContent, "utf8");
  console.log("Saved info.csv");

  event.reply("create-queue-item-result", { success: true, targetFolder });
});

ipcMain.handle("get-all-queue-items", async (event) => {
  try {
    if (!fs.existsSync(baseFolderPath)) {
      return []; // No base folder → empty array
    }

    const entries = fs.readdirSync(baseFolderPath, { withFileTypes: true });

    const results = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderName = entry.name;
        const infoPath = path.join(baseFolderPath, folderName, "info.csv");

        if (fs.existsSync(infoPath)) {
          const content = fs.readFileSync(infoPath, "utf-8");

          results.push({
            folder: folderName,
            infoPath: infoPath,
            content: content,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error reading info.csv files:", error);
    return [];
  }
});
