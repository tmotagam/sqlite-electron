# Sqlite Electron

Sqlite Electron is a module for electron to use sqlite3 database without rebuilding it supports Windows (x64, x32) and Linux (x64). It supports ESM and CJS.

Several bugs fixed and now all data types are supported

## Installation

Use the package manager [npm](https://www.npmjs.com/package/sqlite-electron) to install Sqlite Electron.

```bash
npm install sqlite-electron
```

OR

Use the package manager [yarn](https://yarnpkg.com/package/sqlite-electron) to install Sqlite Electron.

```bash
yarn add sqlite-electron
```

## Notes

1. The package installs the prebuilt binaries of the sqlite on your system (if your system is supported) if you want any other platform binaries for a specific version go to https://github.com/tmotagam/sqlite-electron/releases.

2. The example written for this library is not a Boilerplate because of its disregards to the security required for electron so do not use it in your application.

3. Never give values in the query string use values array for giving the values for the query not taking this precaution will result in sql injection attacks !.

Good parctice example

```javascript
import { executeQuery } from "sqlite-electron";
executeQuery(
  "INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?);",
  [var_name, var_age, var_address, var_salary]
); // Do this
```

Bad parctice example:

```javascript
import { executeQuery } from "sqlite-electron";
executeQuery(
  `INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (${var_name}, ${var_age}, ${var_address}, ${var_salary});`
); // Never do this
```

## API`s

| Api                                               |                                                        Description                                                        |
| ------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------: |
| setdbPath(path='')                                |                                      It opens or creates the database for operation                                       |
| executeQuery(Query = '', fetch = '', values = []) | It Executes single query with fetch and values the fetch must be in string eg:- 'all', '1','2'... '' values must be array |
| executeMany(Query = '', values = [])              |                                       It executes single query with multiple values                                       |
| executeScript(scriptName = '')                    |                   It execute the sql script scriptName must be name of the script or the script itself                    |

## Usage

The sqlite-electron should only be required in main process while using in electron

example:

```javascript
const { app, BrowserWindow } = require("electron");
const sqlite = require("sqlite-electron");

function createWindow() {
  // Your Code
}
app.whenReady().then(() => {
  // Your Code
});

app.on("window-all-closed", () => {
  // Your Code
});
```

### setdbPath

This is a function for opening a existing database or creating a new database for operation.

Call this function before calling the other 3 functions.

```javascript
const { app, BrowserWindow, ipcMain } = require("electron");
const sqlite = require("sqlite-electron");

function createWindow() {
  // Your Code
}
app.whenReady().then(() => {
  // Your Code
});

app.on("window-all-closed", () => {
  // Your Code
});

ipcMain.handle("databasePath", async (event, dbPath) => {
  return await sqlite.setdbPath(dbPath);
});
```

Now you can also create In-memory database like this.

```javascript
const { app, BrowserWindow, ipcMain } = require("electron");
const sqlite = require("sqlite-electron");

function createWindow() {
  // Your Code
}
app.whenReady().then(() => {
  // Your Code
});

app.on("window-all-closed", () => {
  // Your Code
});

ipcMain.handle("createInMemoryDatabase", async () => {
  return await sqlite.setdbPath(":memory:");
});
```

### executeQuery

This is the function for executing any single query eg: 'SELECT \* FROM sqlite_main' you can give values through value array and tell the function to fetch data by specifying the fetch parameter eg: "all", 1, 2, 3, .., infinity.

```javascript
const { app, BrowserWindow, ipcMain } = require("electron");
const sqlite = require("sqlite-electron");

function createWindow() {
  // Your Code
}
app.whenReady().then(() => {
  // Your Code
});

app.on("window-all-closed", () => {
  // Your Code
});

ipcMain.handle("databasePath", async (event, dbPath) => {
  return await sqlite.setdbPath(dbPath);
});

ipcMain.handle("executeQuery", async (event, query, fetch, value) => {
  return await sqlite.executeQuery(query, fetch, value);
});
```

### executeMany

This is the function for executing query with multiple values.

eg: ("INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?)", [["Pa", 32, "California", 20000.00], ["Pau", 32, "California", 20000.00], ["P", 32, "California", 20000.00], ["l", 32, "California", 20000.00]]) .

Fetch is not available in this function

```javascript
const { app, BrowserWindow, ipcMain } = require("electron");
const sqlite = require("sqlite-electron");

function createWindow() {
  // Your Code
}
app.whenReady().then(() => {
  // Your Code
});

app.on("window-all-closed", () => {
  // Your Code
});

ipcMain.handle("databasePath", async (event, dbPath) => {
  return await sqlite.setdbPath(dbPath);
});

ipcMain.handle("executeMany", async (event, query, values) => {
  return await sqlite.executeMany(query, values);
});
```

### executeScript

This is the function for executing multiple queries using sql scripts this function returns only true so never use any SELECT command in the sql scripts.

You have to give absolute path of the script or give the script`s content directly as well.

eg: script.sql

```sql
CREATE TABLE IF NOT EXISTS sqlite_main (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NAME TEXT NOT NULL,AGE INT NOT NULL,ADDRESS CHAR(50) NOT NULL,SALARY REAL NOT NULL);
```

```javascript
const { app, BrowserWindow, ipcMain } = require("electron");
const sqlite = require("sqlite-electron");

function createWindow() {
  // Your Code
}
app.whenReady().then(() => {
  // Your Code
});

app.on("window-all-closed", () => {
  // Your Code
});

ipcMain.handle("databasePath", async (event, dbPath) => {
  return await sqlite.setdbPath(dbPath);
});

ipcMain.handle("executeScript", async (event, scriptpath) => {
  return await sqlite.executeScript(scriptpath);
  // or
  return await sqlite.executeScript(
    "CREATE TABLE IF NOT EXISTS sqlite_main (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NAME TEXT NOT NULL,AGE INT NOT NULL,ADDRESS CHAR(50) NOT NULL,SALARY REAL NOT NULL);"
  );
});
```

## Example

[See sqlite-electron in action using electron 25.0.1](https://github.com/tmotagam/sqlite-electron/tree/master/example)

## Contributing

Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you would like to change.

[Github](https://github.com/tmotagam/sqlite-electron)

## License

[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)
