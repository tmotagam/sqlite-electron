
/*
Types for sqlite-electron modules
Copyright (C) 2022  Motagamwala Taha Arif Ali

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
*/

/**
 * @param {number} dbPath - Path of the database
 */

export declare const dbPath: string

/**
 * executeQuery function executes only one query.
 *
 * @param {string} Query - A string param for SQL query
 * @param {string} [fetch] - A optional string param for fetching values from the table
 * @param {(string | number | null | Buffer)[]} [values] - A optional array param for values for a SQL query
 * @return {Promise<Boolean | []>} Promise of boolean or an array is returned if fetch is defined
 *
 * @example
 *
 *     executeQuery(Query='SELECT * FROM sqlite_master', fetch='all')
 *     executeQuery(Query='INSERT INTO sqlite_master (name, email, joining_date, salary) values(?,?,?,?)', fetch='', values=['John Doe','example@sqlite-electron.com','1250-12-19',8000000])
 */

export declare function executeQuery(Query: string, fetch?: string, values?: (string | number | null | Buffer)[]): Promise<Boolean | []>

/**
 * executeMany function executes only one query on multiple values useful for bulk write.
 *
 * @param {string} Query - A string param for SQL query
 * @param {(string | number | null | Buffer)[]} v - A array param for values for a SQL query
 * @return {Promise<Boolean>} Promise of boolean is returned
 *
 * @example
 *
 *     executeQuery(Query='INSERT INTO sqlite_master (name, email, joining_date, salary) values(?,?,?,?)', fetch='', v=[['John Doe','example@sqlite-electron.com','1250-12-19',8000000], ['John Doe','example@sqlite-electron.com','1250-12-19',8000000]])
 */

export declare function executeMany(Query: string, v: (string | number | null | Buffer)[]): Promise<boolean>

/**
 * executeScript function executes all the queries given in the sql script.
 *
 * @param {string} scriptName - A path param for sql script or sql script itself
 * @return {Promise<Boolean>} Promise of boolean is returned
 *
 * @example
 *
 *     executeScript(scriptName='./script.sql')
 *     executeScript(scriptName='CREATE TABLE IF NOT EXISTS comp (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NAME TEXT NOT NULL,AGE INT NOT NULL,ADDRESS CHAR(50) NOT NULL,SALARY REAL NOT NULL);')
 */

export declare function executeScript(scriptName: string): Promise<Boolean>
