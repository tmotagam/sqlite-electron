/*
Types for sqlite-electron modules
Copyright (C) 2020-2025  Motagamwala Taha Arif Ali

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
 * @param {boolean} isuri - true if path is a URL
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     setdbPath(path='./path/to/db/path.db')
 *     setdbPath(path=':memory:') // In-memory database
 *     setdbPath(path='file:tutorial.db?mode=ro', isuri=true) // Opening read-only database using SQLite URI
 */
export declare function setdbPath(
  path: string,
  isuri?: boolean
): Promise<Boolean>;

/**
 * executeQuery function executes only one query.
 *
 * @param {string} query - SQL query
 * @param {Array<string | number | null | Buffer>} values - An optional param for values used in a SQL query
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     executeQuery(query='CREATE TABLE sqlite_master (name, email, joining_date, salary)')
 *     executeQuery(query='INSERT INTO sqlite_master (name, email, joining_date, salary) values(?,?,?,?)', values=['John Doe','example@sqlite-electron.com','1250-12-19',8000000])
 */
export declare function executeQuery(
  query: string,
  values?: Array<string | number | null | Buffer>
): Promise<Boolean>;

/**
 * Fetches all the records from the database based on the given query
 * and returns the result as an array of the specified type.
 *
 * @param {string} query the SQL query to be executed
 * @param {Array<string | number | null | Buffer>} values optional array of values to be used in the query
 * @return {Promise<Array<T>>} A promise that resolves to an array of objects of the specified type.
 */
export declare function fetchAll<T>(
  query: string,
  values?: Array<string | number | null | Buffer>
): Promise<Array<T>>;

/**
 * Fetches single records from the database based on the given query
 * and returns the result as an object of the specified type.
 *
 * @param {string} query The SQL query to execute.
 * @param {Array<string | number | null | Buffer>} values Optional values to bind to the query parameters.
 * @return {Promise<T>} A promise that resolves to an object of the specified type.
 */
export declare function fetchOne<T>(
  query: string,
  values?: Array<string | number | null | Buffer>
): Promise<T>;

/**
 * Fetches multiple records from the database based on the given query
 * and returns the result as an array of the specified type.
 *
 * @param {string} query The query to execute on the database.
 * @param {number} size The number of records to fetch.
 * @param {Array<string | number | null | Buffer>} values Optional values to be used in the query parameters.
 * @return {Promise<Array<T>>} A promise that resolves to an array of object of the specified type.
 */
export declare function fetchMany<T>(
  query: string,
  size: number,
  values?: Array<string | number | null | Buffer>
): Promise<Array<T>>;

/**
 * executeMany function executes only one query on multiple values useful for bulk write.
 *
 * @param {string} query - SQL query
 * @param {Array<Array<string | number | null | Buffer>>} values - A param for values used in a SQL query
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     executeMany(query='INSERT INTO sqlite_master (name, email, joining_date, salary) values(?,?,?,?)', values=[['John Doe','example@sqlite-electron.com','1250-12-19',8000000], ['John Doe','example@sqlite-electron.com','1250-12-19',8000000]])
 */
export declare function executeMany(
  query: string,
  values: Array<Array<string | number | null | Buffer>>
): Promise<boolean>;

/**
 * executeScript function executes all the queries given in the sql script.
 *
 * @param {string} scriptname - A path param for sql script or sql script itself
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     executeScript(scriptname='C://database//script.sql')
 *     executeScript(scriptname='CREATE TABLE IF NOT EXISTS comp (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,NAME TEXT NOT NULL,AGE INT NOT NULL,ADDRESS CHAR(50) NOT NULL,SALARY REAL NOT NULL);')
 */
export declare function executeScript(scriptname: string): Promise<Boolean>;

/**
 * load_extension function loads an extension into the database.
 *
 * @param {string} path - Path of the extension
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     load_extension(path='./fts5')
 */
export declare function load_extension(path: string): Promise<Boolean>;

/**
 * backup function creates a backup of the database.
 *
 * @param {string} target - The database connection to save the backup to.
 * @param {number} pages - The number of pages to copy at a time. If equal to or less than 0, the entire database is copied in a single step. Defaults to -1.
 * @param {string} name - The name of the database to back up. Either "main" (the default) for the main database, "temp" for the temporary database, or the name of a custom database as attached using the ATTACH DATABASE SQL statement.
 * @param {number} sleep - The number of seconds to sleep between successive attempts to back up remaining pages.
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     backup(target='./backup.db', pages=10, name='main', sleep=10)
 */
export declare function backup(target: string, pages?: number, name?: string, sleep?: number): Promise<Boolean>;

/**
 * iterdump function generates an iterable of SQL commands that can recreate the entire database schema and data.
 *
 * @param {string} file - The name of the file to dump the data to in sql format.
 * @param {string} filter - The filter to use when dumping the data.
 * @return {Promise<Boolean>} boolean
 *
 * @example
 *
 *     iterdump(file='./dump.sql')
*/
export declare function iterdump(file: string, filter?: string): Promise<Boolean>;
