# Sqlite Electron

Sqlite Electron is a module only for electron to use sqlite3 database without rebuilding

## Installation

Use the package manager [npmjs](https://npmjs.com/) to install Sqlite Electron.

```bash
npm install sqlite-electron
```

## Usage

```javascript
const sqlite = require('sqlite-electron');

sqlite.init()
.then((result) => {console.log(result)})
.catch((err) => {console.log(err)});
```
## Functions

| Functions        | Description           |
| ---------------- |:---------------------:|
| init()           | Connect and start the server         |
| Connect(dataBasename = '', additionalPath = '')            | It connects to the Database  by providing the database name and optional path if you want             |
| executeQuery(Query = '', fetch = '', values = [])       | It Executes single query with fetch and values the fetch must be in string eg:- 'all', '1','2'... '' values must be array            |
| executeMany(Query = '', values = [])      | It executes single query with multiple values |
| executeScript(scriptName = '')      | It execute the sql script scriptName must be name of the script      |
| Close() | It closes the connection with database      |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

[Github](https://github.com/tmotagam/sqlite-electron)

## License
[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)