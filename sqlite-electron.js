/*! *****************************************************************************
sqlite-electron module for electron and nodejs
Copyright (C) 2021  Motagamwala Taha Arif Ali

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
***************************************************************************** */

/**
 * Module for using sqlite3 in electron without rebuilding works only on win32
 */
const { execFile } = require('child_process');
const path = require('path');

/**
 * This is a internal function for detecting electron to get correct path
 */

const electronNodeDetection = () => {
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        if (process.defaultApp) {
            return path.join(path.dirname(require.main.filename), module.exports.dbPath);
        } else {
            return path.join(path.dirname(process.execPath), module.exports.dbPath);
        }
    } else {
        return path.join(path.dirname(require.main.filename), module.exports.dbPath);
    }
}

/**
 * Executes a single query takes 3 parameters
 * @param Query The string for the SQL queries eg: SELECT * FROM tables.
 * @param fetch(Optional) This is used to specify whether the user wants all the values from the table or single value or multiple values eg: "all", 1, 2, 3, .., .
 * @param values(Optional) This is used for specifing values to be sent with the SQL queries eg: ["name", 20000, "example street", 1234567890].
 * @returns Either true or an array when fetch is specified also returns error string when something goes wrong.
 */

const executeQuery = (Query = '', fetch = '', values = []) => {
    return new Promise((resolve, reject) => {
        try {

            const fullpath = electronNodeDetection()

            let sqlitePath = __dirname + '\\sqlite.exe';
            sqlite = execFile(sqlitePath);
        
            let string = '';
        
            sqlite.stdin.write(JSON.stringify(['executeQuery', fullpath, Query, fetch, values]))
            sqlite.stdin.end()
        
            sqlite.stdout.on('data', (data) => {
                string += data.toString()
            })
            
            sqlite.stdout.on('end', () => {
                sqlite.kill()
                resolve(JSON.parse(string))
            })
        } catch (error) {
            reject(error)
        }
    });
}

/**
 * Executes a single query on multiple values
 * @param Query The string for the SQL queries eg: SELECT * FROM tables.
 * @param v This is used for specifing values to be sent with the SQL queries eg: [["name", 20000, "example street", 1234567890], ["name1", 20, "example street", 123]].
 * @returns true or error string
 */

const executeMany = (Query = '', v = []) => {
    return new Promise((resolve, reject) => {
        try {

            const fullpath = electronNodeDetection()

            let sqlitePath = __dirname + '\\sqlite.exe';
            sqlite = execFile(sqlitePath);
        
            let string = '';
        
            sqlite.stdout.on('data', (data) => {
                string += data.toString()
            })
            
            sqlite.stdout.on('end', () => {
                sqlite.kill()
                resolve(JSON.parse(string))
            })
            
            sqlite.stdin.write(JSON.stringify(['executeMany', fullpath, Query, v]))
            sqlite.stdin.end()
        } catch (error) {
            reject(error)
        }
    });
}
/**
 * 
 * @param scriptName The path of the SQL script to execute eg: ./scripts/myScript.sql .
 * @returns true or error string
 */
const executeScript = (scriptName = '') => {
    return new Promise((resolve, reject) => {
        try {

            const fullpath = electronNodeDetection()

            let sqlitePath = __dirname + '\\sqlite.exe';
            sqlite = execFile(sqlitePath);
        
            let string = '';
        
            sqlite.stdout.on('data', (data) => {
                string += data.toString()
            })
            
            sqlite.stdout.on('end', () => {
                sqlite.kill()
                resolve(JSON.parse(string))
            })
            
            sqlite.stdin.write(JSON.stringify(['executeScript', fullpath, scriptName]))
            sqlite.stdin.end()
        } catch (error) {
            reject(error)
        }
    });
}

module.exports.dbPath = ''
module.exports.executeQuery = executeQuery
module.exports.executeMany = executeMany
module.exports.executeScript = executeScript