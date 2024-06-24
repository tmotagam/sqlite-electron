# Sqlite Electron

Sqlite Electron is a module for electron to use sqlite3 database without rebuilding it supports Windows (x64, x32) and Linux (x64). It supports ESM and CJS.

Changes:

* Loads SQLite extensions like fts5 into the database using the new load_extension function.

* Also the setdbPath function will now accept absolute and relative paths of the databases.

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
| setdbPath(path='', isuri=false)                                |                                      It opens or creates the database for operation supports the InMemory databases and also SQLite URI format also the database path can be relative or absolute                                      |
| executeQuery(query = '', values = []) | It Executes single query with values they must be array |
| executeMany(query = '', values = [])              |                                       It executes single query with multiple values                                       |
| executeScript(scriptname = '')                    |                   It execute the sql script scriptName must be name of the script or the script itself                    |
| fetchAll(query = '', values = [])                    |                   It fetches all the values that matches the query. The values can also be given for the query using values array                    |
| fetchOne(query = '', values = [])                    |                       It fetches only one value that matches the query. The values can also be given for the query using values array                |
| fetchMany(query = '', size = 5 values = [])                    |                   It fetches as many values as defined in size parameter that matches the query. The values can also be given for the query using values array                    
|          load_extension(path = '')         |                   It loads SQLite extension from the given path for the connected database.                   |

## Usage

The sqlite-electron should only be used in main process in electron

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

Call this function before calling the other 7 functions.

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

You can create an In-memory database like this.

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

You can also use the SQLite URI format like this.

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

ipcMain.handle("createDatabaseusingURI", async () => {
  return await sqlite.setdbPath("file:tutorial.db?mode:rw", isuri=true);
});
```

### executeQuery

This is the function for executing any single query eg: 'INSERT INTO tutorial (x) VALUES (?)' you can give values through the values array.

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

ipcMain.handle("executeQuery", async (event, query, values) => {
  return await sqlite.executeQuery(query, values);
});
```

### fetchAll

This is the function for fetching all the rows that can be retrived using the given query eg: 'SELECT \* from tutorial' you can give values through the values array they will return the data in the Object format like this [{name: 'b', ...}, {name: 'a', ...}, {name: 'c', ...}].

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

ipcMain.handle("fetchAll", async (event, query, values) => {
  return await sqlite.fetchAll(query, values);
});
```

### fetchOne

This is the function for fetching only one row that can be retrived using the given query eg: 'SELECT \* from tutorial WHERE ID=?' you can give values through the values array they will return the data in the Object format like this {name: 'a', ...}.

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

ipcMain.handle("fetchOne", async (event, query, values) => {
  return await sqlite.fetchOne(query, values);
});
```

### fetchMany

This is the function for fetching as many rows as the size parameter allows that can be retrived using the given query eg: 'SELECT \* from tutorial WHERE name=?' you can give values through the values array they will return the data in the Object format like this [{name: 'a', ...}, {name: 'a', ...}, {name: 'a', ...}].

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

ipcMain.handle("fetchMany", async (event, query, size, values) => {
  return await sqlite.fetchMany(query, size, values);
});
```

### executeMany

This is the function for executing query with multiple values.

eg: ("INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?)", [["Pa", 32, "California", 20000.00], ["Pau", 32, "California", 20000.00], ["P", 32, "California", 20000.00], ["l", 32, "California", 20000.00]]) .

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

You have to give absolute or relative path of the script or give the script`s content directly as well.

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

### load_extension

This function loads the SQLite extension from the given path for the connected database the path must be absolute.

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

ipcMain.handle("load_extension", async (event, path) => {
  return await sqlite.load_extension(path);
});
```

## Example

[See sqlite-electron in action using electron 31.0.1](https://github.com/tmotagam/sqlite-electron/tree/master/example)

## Contributing

Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you would like to change.

[Github](https://github.com/tmotagam/sqlite-electron)

## License

[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)
