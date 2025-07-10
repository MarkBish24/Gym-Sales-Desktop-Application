const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createQueueItem: (fileString, title, message, time, date, sendMode) => {
    const queueData = { fileString, title, message, time, date, sendMode };
    ipcRenderer.send("create-queue-item", queueData);
  },
  getAllQueueItems: () => ipcRenderer.invoke("get-all-queue-items"),
  deleteQueueItem: (folderName) =>
    ipcRenderer.invoke("delete-queue-item", folderName),
  startSalesBot: (folder, loginData) =>
    ipcRenderer.invoke("start-sales-bot", folder, loginData),
  killBot: (folderName) => ipcRenderer.invoke("kill-bot", folderName),
  getInfo: (folderName) => ipcRenderer.invoke("get-info", folderName),
});
