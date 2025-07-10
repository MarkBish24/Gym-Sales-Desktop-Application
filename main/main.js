const { app, BrowserWindow, ipcMain } = require("electron");

const { startSalesBot } = require("./bot.js");

const fs = require("fs");
const path = require("path");

const parse = require("csv-parse/sync");
const stringify = require("csv-stringify/sync");

//Base Folder used to store data
const baseFolderPath = path.join(__dirname, "../python/csv-data");

const runningBots = new Map();

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

  //create both the members.csv and the info.json

  const membersPath = path.join(targetFolder, "members.csv");

  const lines = fileString.split(/\r?\n/).filter((line) => line.trim() !== "");

  const header = lines[0].trim() + ",message_sent";
  const updatedLines = [header];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      updatedLines.push(`${line}, null`);
    }
  }

  fs.writeFileSync(membersPath, updatedLines.join("\n"), "utf-8");
  console.log("Saved members.csv");

  const membersCount = Math.max(lines.length - 1, 0);

  const sentCount = 0;
  const errorCount = 0;

  // create info.json instead of info.csv
  const infoPath = path.join(targetFolder, "info.json");
  const infoContent = {
    title,
    message,
    date,
    time,
    sendMode,
    members: membersCount,
    sent: sentCount,
    error: errorCount,
  };

  fs.writeFileSync(infoPath, JSON.stringify(infoContent, null, 2), "utf8");
  console.log("Saved info.json");

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
        const infoPath = path.join(baseFolderPath, folderName, "info.json");

        if (fs.existsSync(infoPath)) {
          const content = fs.readFileSync(infoPath, "utf-8");
          const jsonData = JSON.parse(content);

          results.push({
            folder: folderName,
            infoPath: infoPath,
            info: jsonData,
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error("Error reading info.json files:", error);
    return [];
  }
});

ipcMain.handle("delete-queue-item", async (event, folderName) => {
  try {
    const folderPath = path.join(baseFolderPath, folderName);

    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true }); // deletes folder and contents
      return { success: true };
    } else {
      return { success: false, error: "Folder does not exist" };
    }
  } catch (error) {
    console.error("Failed to delete folder:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("start-sales-bot", async (event, folderName, loginData) => {
  if (runningBots.has(folderName)) {
    return { success: false, error: "Bot already running for this folder." };
  }

  const abortController = { aborted: false };
  runningBots.set(folderName, abortController);

  try {
    await startSalesBot(folderName, loginData, () => abortController.aborted);
    runningBots.delete(folderName);
    return { success: true };
  } catch (err) {
    runningBots.delete(folderName);
    console.error("Bot error:", err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle("kill-bot", (event, folderName) => {
  const bot = runningBots.get(folderName);
  if (bot) {
    bot.aborted = true;
    return { success: true };
  }
  return { success: false, error: "No running bot for this folder." };
});

ipcMain.handle("get-info", async (event, folderName) => {
  const infoPath = path.join(baseFolderPath, folderName, "info.json");
  if (!fs.existsSync(infoPath)) return null;
  const content = fs.readFileSync(infoPath, "utf-8");
  return JSON.parse(content);
});
