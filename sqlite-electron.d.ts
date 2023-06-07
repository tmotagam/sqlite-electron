/*
Types for sqlite-electron modules
Copyright (C) 2022-2023  Motagamwala Taha Arif Ali

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
 * setdbPath function allows for connecting to the database.
 *
 * @param {string} path - Relative path of a database since it constructs absolute path by itself
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     setdbPath(path='./path/to/db/path.db')
 *     setdbPath(path=':memory:') // In-memory database
 */

export declare function setdbPath(path: string): Promise<Boolean>;

/**
 * executeQuery function executes only one query.
 *
 * @param {string} Query - SQL query
 * @param {string} [fetch] - An optional param for fetching values from the table
 * @param {Array<string | number | null | Buffer>} [values] - An optional param for values used in a SQL query
 * @return {Promise<Boolean | Array<any> | Array<Array<any>>>} Boolean or an array if fetch is defined
 *
 * @example
 *
 *     executeQuery(Query='SELECT * FROM sqlite_master', fetch='all')
 *     executeQuery(Query='INSERT INTO sqlite_master (name, email, joining_date, salary) values(?,?,?,?)', fetch='', values=['John Doe','example@sqlite-electron.com','1250-12-19',8000000])
 */

export declare function executeQuery(
  Query: string,
  fetch?: string,
  values?: Array<string | number | null | Buffer>
): Promise<Boolean | Array<any> | Array<Array<any>>>;

/**
 * executeMany function executes only one query on multiple values useful for bulk write.
 *
 * @param {string} Query - SQL query
 * @param {Array<Array<string | number | null | Buffer>>} v - A param for values used in a SQL query
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     executeMany(Query='INSERT INTO sqlite_master (name, email, joining_date, salary) values(?,?,?,?)', v=[['John Doe','example@sqlite-electron.com','1250-12-19',8000000], ['John Doe','example@sqlite-electron.com','1250-12-19',8000000]])
 */

export declare function executeMany(
  Query: string,
  v: Array<Array<string | number | null | Buffer>>
): Promise<boolean>;

/**
 * executeScript function executes all the queries given in the sql script.
 *
 * @param {string} scriptName - A path param for sql script or sql script itself
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     executeScript(scriptName='C://database//script.sql')
 *     executeScript(scriptName='CREATE TABLE IF NOT EXISTS comp (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NAME TEXT NOT NULL,AGE INT NOT NULL,ADDRESS CHAR(50) NOT NULL,SALARY REAL NOT NULL);')
 */

export declare function executeScript(scriptName: string): Promise<Boolean>;
