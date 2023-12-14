const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
const { setdbPath, executeQuery, executeMany, executeScript, fetchOne, fetchMany, fetchAll } = require("sqlite-electron");

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

ipcMain.handle("potd", async (event, dbPath, isuri) => {
  try {
    return await setdbPath(dbPath, isuri)
  } catch (error) {
    return error
  }
});

ipcMain.handle("executeQuery", async (event, query, value) => {
  try {
    return await executeQuery(query, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("fetchone", async (event, query, value) => {
  try {
    return await fetchOne(query, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("fetchmany", async (event, query, size, value) => {
  try {
    return await fetchMany(query, size, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("fetchall", async (event, query, value) => {
  try {
    return await fetchAll(query, value);
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
