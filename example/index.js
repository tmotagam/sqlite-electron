const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
const { setdbPath, executeQuery, executeMany, executeScript } = require("sqlite-electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}
app.enableSandbox();
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("potd", async (event, dbPath) => {
  try {
    return await setdbPath(dbPath)
  } catch (error) {
    return error
  }
});

ipcMain.handle("executeQuery", async (event, query, fetch, value) => {
  try {
    return await executeQuery(query, fetch, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("executeMany", async (event, query, values) => {
  try {
    return await executeMany(query, values);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("executeScript", async (event, scriptpath) => {
  try {
    return await executeScript(scriptpath);
  } catch (error) {
    return error;
  }
});
