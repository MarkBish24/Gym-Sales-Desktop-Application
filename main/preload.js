const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createQueueItem: (file, title, message, time, date, sendMode) => {
    const queueData = { file, title, message, time, date, sendMode };
    ipcRenderer.send("create-queue-item", queueData);
  },
});
