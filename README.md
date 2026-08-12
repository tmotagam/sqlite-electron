# Sqlite Electron

Sqlite Electron is a module for electron to use sqlite3 database without rebuilding it.

Supports ***Windows*** (**x64**, **x32**, **arm64**), ***Linux*** (**x64**, **arm64**), and ***MacOS*** (**x64**, **arm64**).

***ESM*** and ***CJS*** formats are supported.

> ***Changes***: 
>
>>**Major bug fixes and performance improvements**
>
>>**Added entrypoint parameter in load_extension function**

# Installation

Use the package manager [npm](https://www.npmjs.com/package/sqlite-electron) to install Sqlite Electron.

>[!IMPORTANT]
>
> Please add **sqlite-electron** in allowScripts to do so run command `npm approve-scripts sqlite-electron`
>
> **Why do you need to do this ?** - The package installs the **prebuilt binaries** of **sqlite engine** on your system matching your platform and architecture from the **[sqlite-electron](https://github.com/tmotagam/sqlite-electron/releases) Github Repository Releases section** during install time so that the module can run sqlite engine. For this I use **post-install script** thats why you need to run the above command.

```bash
npm install sqlite-electron
```

OR

Use the package manager [yarn](https://yarnpkg.com/package/sqlite-electron) to install Sqlite Electron.

```bash
yarn add sqlite-electron
```

# SQEL_PLATFORM_ARCH_IDENTIFIER

**The *SQEL_PLATFORM_ARCH_IDENTIFIER* environment variable is used to download any platform binaries on any other platform.**

**Eg. create electron app for Mac OS on Windows OS the sqlite-electron library post-install will install the Mac OS related binary allowing you to build the .exe .dmg .rpm etc for any platform on any platform.**

**The valid options for this environment variable are as follows**

***1. win32-x64, win32-ia32, win32-arm64***

***2. linux-x64, linux-arm64***

***3. darwin-x64, darwin-arm64***

>[!CAUTION]
>*1. The **example** written for this library **disregards** the required **security** for the electron apps so do not use it as starting point in your applications.*
>
>*2. **Never** give values in the query string **use values array/object** for giving the values for the query not taking this precaution will result in **SQL injection attacks** !.*
>
>Good practice example
>
>```javascript
>import { executeQuery } from "sqlite-electron";
>executeQuery(
>  "INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (:NAME, :AGE, :ADDRESS, :SALARY);",
>  {NAME: var_name, AGE: var_age, ADDRESS: var_address, SALARY: var_salary}
>); // Do this
>executeQuery(
>  "INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?);",
>  [var_name, var_age, var_address, var_salary]
>); // Or do this
>```
>
>Bad practice example:
>
>```javascript
>import { executeQuery } from "sqlite-electron";
>executeQuery(
>  `INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (${var_name}, ${var_age}, ${var_address}, ${var_salary});`
>); // Never do this
>```

# API

| Api                                               |                                                        Description                                                        |
| ------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------: |
| setdbPath(path='', isuri=false, autocommit=true)                                |                                      It opens or creates the database for operation supports the InMemory databases and also SQLite URI format also the database path can be relative or absolute. Added autocommit to make the sql transaction either commit or rollback automatically or manually                |
| executeQuery(query = '', values = []) | It Executes single query with values they can be array or object |
| executeMany(query = '', values = [])              |                                       It executes single query with multiple values                                       |
| executeScript(scriptname = '')                    |                   It execute the SQL script scriptName must be name of the script or the script itself                    |
| fetchAll(query = '', values = [])                    |                   It fetches all the values that matches the query. The values can also be given for the query using values array or object                    |
| fetchOne(query = '', values = [])                    |                       It fetches only one value that matches the query. The values can also be given for the query using values array or object                |
| fetchMany(query = '', size = 5 values = [])                    |                   It fetches as many values as defined in size parameter that matches the query. The values can also be given for the query using values arrays or array of object                    
|          load_extension(path = '', entrypoint = null)         |                   It loads SQLite extension from the given path for the connected database. The entrypoint parameter is used to give the extension loader name of the extension entry point otherwise the extension loader will figure out the entrypoint on its own. Default value is null.                   |
| backup(target='', pages=-1, name='main', sleep=0.250)   |  It backs up the database to the target database. The pages can be used if the database is very big. The name is used for the database to backup. Sleep is used to pause the operation for the specified seconds between backup of the specified number of pages.  |
| iterdump(file='', filter=null) |  It generates an iterable of SQL commands that can recreate the entire database schema and data. The file parameter is used to save all the generated SQL commands. The filter is used to filter the databases to be generated as SQL commands the default is null which means the entire database is to be generated.  |

# Usage

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

## setdbPath

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

You can use the SQLite URI format like this.

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
You can use autocommit like this.

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

ipcMain.handle("Databasewithautocommit", async (event, dbPath, isuri) => {
  return await sqlite.setdbPath(dbPath, isuri, false);
});
```

## executeQuery

This is the function for executing any single query eg: 'INSERT INTO tutorial (x) VALUES (?) / INSERT INTO tutorial (x) VALUES (:x)' you can give values using array or object.

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

ipcMain.handle("executeQueryArray", async (event, query, values) => {
  return await sqlite.executeQuery(query, []);
});

ipcMain.handle("executeQueryObject", async (event, query, values) => {
  return await sqlite.executeQuery(query, {});
});
```

## fetchAll

This is the function for fetching all the rows that can be retrived using the given query eg: 'SELECT \* from tutorial' you can give values using array or object it will return the data in the Object format like this [{name: 'b', ...}, {name: 'a', ...}, {name: 'c', ...}].

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

## fetchOne

This is the function for fetching only one row that can be retrived using the given query eg: 'SELECT \* from tutorial WHERE ID=?' you can give values using  array or object it will return the data in the Object format like this {name: 'a', ...}.

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

## fetchMany

This is the function for fetching as many rows as the size parameter allows that can be retrived using the given query eg: 'SELECT \* from tutorial WHERE name=?' you can give values through array of arrays or array of objects it will return the data in the Object format like this [{name: 'a', ...}, {name: 'a', ...}, {name: 'a', ...}].

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

## executeMany

This is the function for executing query with multiple values. Useful for inserting, updating or deleting multiple rows at once.

eg: ("INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?)", [ ["Pa", 32, "California", 20000.00], ["Pau", 32, "California", 20000.00], ["P", 32, "California", 20000.00], ["l", 32, "California", 20000.00] ]) .

eg: (query='INSERT INTO sqlite_master (name, email, joining_date, salary) values(:name, :email, :joining_date, :salary)', values=[{'name':'John Doe','email':'example@sqlite-electron.com','joining_date':'1250-12-19','salary':8000000}]) .

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

## executeScript

This is the function for executing multiple queries using SQL scripts this function returns only true so never use any SELECT command in the SQL scripts.

You have to give absolute or relative path of the script or you can give the script`s content directly as well.

eg: script.sql

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

## load_extension

This function loads the SQLite extension from the given path for the connected database the path must be absolute. The entrypoint parameter is used to give extention loader entrypoint into the extention if null (default value) it will try to guess the entrypoint on its own.

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

ipcMain.handle("load_extension", async (event, path, entrypoint = null) => {
  return await sqlite.load_extension(path, entrypoint);
});
```

## backup

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

## iterdump

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

# Example

**[See sqlite-electron in action using electron 43.3.0](https://github.com/tmotagam/sqlite-electron/tree/master/example)**

# Contributing

**Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you would like to change.**

**[Github](https://github.com/tmotagam/sqlite-electron)**

# License

**[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)**
