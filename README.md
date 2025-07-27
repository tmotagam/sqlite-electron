# Sqlite Electron

Sqlite Electron is a module for electron to use sqlite3 database without rebuilding it supports Windows (x64, x32) and Linux (x64, arm64). It supports ESM and CJS.

Changes:

*iterdump function to generate an iterable of SQL commands that can recreate the entire database schema and data*

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

*1. Due to package building issues the sqlite3 prebuilt for x32 windows system is currently unavailable for version 3.3.3 it will be available as soon as issues are resolved.*

*2. The package installs the prebuilt binaries of the sqlite on your system (if your system is supported) if you want any other platform binaries for a specific version go to https://github.com/tmotagam/sqlite-electron/releases.*

*3. The example written for this library disregards the required security for the electron apps so do not use it as starting point in your applications.*

*4. Never give values in the query string use values array for giving the values for the query not taking this precaution will result in SQL injection attacks !.*

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
| executeScript(scriptname = '')                    |                   It execute the SQL script scriptName must be name of the script or the script itself                    |
| fetchAll(query = '', values = [])                    |                   It fetches all the values that matches the query. The values can also be given for the query using values array                    |
| fetchOne(query = '', values = [])                    |                       It fetches only one value that matches the query. The values can also be given for the query using values array                |
| fetchMany(query = '', size = 5 values = [])                    |                   It fetches as many values as defined in size parameter that matches the query. The values can also be given for the query using values array                    
|          load_extension(path = '')         |                   It loads SQLite extension from the given path for the connected database.                   |
| backup(target='', pages=-1, name='main', sleep=0.250)   |  It backs up the database to the target database. The pages can be used if the database is very big. The name is used for the database to backup. Sleep is used to pause the operation for the specified seconds between backup of the specified number of pages.  |
| iterdump(file='', filter=null) |  It generates an iterable of SQL commands that can recreate the entire database schema and data. The file parameter is used to save all the generated SQL commands. The filter is used to filter the databases to be generated as SQL commands the default is null which means the entire database is to be generated.  |

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

This is the function for executing multiple queries using SQL scripts this function returns only true so never use any SELECT command in the SQL scripts.

You have to give absolute or relative path of the script or give the script`s content directly as well.

eg: script.SQL

```SQL
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

### backup

Backup the database to another database the target database path can be relative or absolute.

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

ipcMain.handle("backup", async (event, target, pages, name, sleep) => {
  return await backup(target, pages, name, sleep);
});
```

### iterdump

Generates the database schema and its data as an SQL commands the file path can be relative or absolute.

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

ipcMain.handle("iterdump", async (event, file, filter) => {
  return await iterdump(file, filter);
});
```

## Example

**[See sqlite-electron in action using electron 37.2.3](https://github.com/tmotagam/sqlite-electron/tree/master/example)**

## Contributing

**Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you would like to change.**

**[Github](https://github.com/tmotagam/sqlite-electron)**

## License

**[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)**
