const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createQueueItem: (file, title, message, time, date, sendMode) => {
    const data = { file, title, message, time, date, sendMode };
    ipcRenderer.send("create-queue-item", data);
  },
});
