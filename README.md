# Sqlite Electron

Sqlite Electron is a module for electron and nodejs to use sqlite3 database without rebuilding as of now supports only Windows(win32).

## Installation

Use the package manager [npm](https://npmjs.com/) to install Sqlite Electron.

```bash
npm install sqlite-electron
```

## Functions

| Functions        | Description           |
| ---------------- |:---------------------:|
| dbPath           | Variable to set your path for the database and also to connect to the database if it already exists         |
| executeQuery(Query = '', fetch = '', values = [])       | It Executes single query with fetch and values the fetch must be in string eg:- 'all', '1','2'... '' values must be array            |
| executeMany(Query = '', values = [])      | It executes single query with multiple values |
| executeScript(scriptName = '')      | It execute the sql script scriptName must be name of the script      |

## Usage

The sqlite-electron should only be required in main process while using in electron

example:

```javascript
const { app, BrowserWindow } = require('electron')
const sqlite = require('sqlite-electron')

function createWindow () {
    // Your Code
}
app.whenReady().then(() => {
    // Your Code
})

app.on('window-all-closed', () => {
    // Your Code
})
```

### dbPath

This is a exposed variable for setting the path of the new database and also for connecting to the existing database.

Set this variable before using any of the 3 api.

```javascript
const { app, BrowserWindow, ipcMain } = require('electron')
const sqlite = require('sqlite-electron')

function createWindow () {
    // Your Code
}
app.whenReady().then(() => {
    // Your Code
})

app.on('window-all-closed', () => {
    // Your Code
})

ipcMain.handle('databasePath', (event, dbPath) => {
  sqlite.dbPath = dbPath
  return true
})
```

### executeQuery

This is the function for executing any single query eg: 'SELECT * FROM sqlite_main' you can give values through value array and tell the function to fetch data by specifying the fetch parameter eg: "all", 1, 2, 3, .., infinity.

Note: Never give values in the query string use value array for giving the values for the query not taking this precaution will result in sql injection attacks !.

eg: ("INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?);", ["name", 900, "example street", 123456789000]) // This is best practice

```javascript
const { app, BrowserWindow, ipcMain } = require('electron')
const sqlite = require('sqlite-electron')

function createWindow () {
    // Your Code
}
app.whenReady().then(() => {
    // Your Code
})

app.on('window-all-closed', () => {
    // Your Code
})

ipcMain.handle('databasePath', (event, dbPath) => {
  sqlite.dbPath = dbPath
  return true
})

ipcMain.handle('executeQuery', async (event, query, fetch, value) => {
  return await sqlite.executeQuery(query, fetch, value);
})
```

### executeMany

This is the function for executing query with multiple values.

eg: ("INSERT INTO sqlite_main (NAME,AGE,ADDRESS,SALARY) VALUES (?, ?, ?, ?)", [["Pa", 32, "California", 20000.00], ["Pau", 32, "California", 20000.00], ["P", 32, "California", 20000.00], ["l", 32, "California", 20000.00]]) .

Fetch is not available in this function

```javascript
const { app, BrowserWindow, ipcMain } = require('electron')
const sqlite = require('sqlite-electron')

function createWindow () {
    // Your Code
}
app.whenReady().then(() => {
    // Your Code
})

app.on('window-all-closed', () => {
    // Your Code
})

ipcMain.handle('databasePath', (event, dbPath) => {
  sqlite.dbPath = dbPath
  return true
})

ipcMain.handle('executeMany', async (event, query, values) => {
  return await sqlite.executeMany(query, values)
})
```

### executeScript

This is the function for executing multiple queries using sql scripts this function returns only true so never use any SELECT command in the sql scripts.

You have to give absolute path of the script.


eg: script.sql

```sql
CREATE TABLE IF NOT EXISTS sqlite_main (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NAME TEXT NOT NULL,AGE INT NOT NULL,ADDRESS CHAR(50) NOT NULL,SALARY REAL NOT NULL);
```

```javascript
const { app, BrowserWindow, ipcMain } = require('electron')
const sqlite = require('sqlite-electron')

function createWindow () {
    // Your Code
}
app.whenReady().then(() => {
    // Your Code
})

app.on('window-all-closed', () => {
    // Your Code
})

ipcMain.handle('databasePath', (event, dbPath) => {
  sqlite.dbPath = dbPath
  return true
})

ipcMain.handle('executeScript', async (event, scriptpath) => {
  return await sqlite.executeScript(scriptpath);
})
```


## Example
[See sqlite-electron in action using electron 15.3.0](https://github.com/tmotagam/sqlite-electron/tree/master/example)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

[Github](https://github.com/tmotagam/sqlite-electron)

## License
[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)