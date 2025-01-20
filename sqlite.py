"""
sqlite-electorn server executing the sql queries of the nodejs/electron processes
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
"""

import array
import sys, json, sqlite3

conn = None

class ConnectionNotSetUpException(Exception):
    pass

def decodebytes(data: dict):
    """
    Decodes bytes values in a dictionary by converting them to a list of integers.

    Args:
        data (dict): The dictionary containing the bytes values.

    Returns:
        dict: The dictionary with the bytes values replaced by a dictionary with the type "Buffer" and the data as a list of integers.

    Example:
        >>> data = {'a': b'hello', 'b': b'world'}
        >>> decodebytes(data)
        {'a': {'type': 'Buffer', 'data': [104, 101, 108, 108, 111]}, 'b': {'type': 'Buffer', 'data': [119, 111, 114, 108, 100]}}
    """
    for key, val in data.items():
        if type(val) is bytes:
            data[key] = {"type": "Buffer", "data": list(val)}
    return data

def encodebytes(data: list):
    """
    Encodes a list of data by converting elements to array objects based on specific conditions.
    
    Parameters:
        data (list): A list of data to encode.
        
    Returns:
        list: The encoded data list.
    """
    for i, val in enumerate(data):
        try:
            v = json.loads(val)
            if type(v) is dict:
                if "data" in v and "type" in v:
                    if v["type"] == "Buffer" and type(v["data"]) is list:
                        data[i] = array.array("B", v["data"])
        except Exception:
            pass
    return data

def newConnection(db: str, isuri: bool):
    """
    Function for establishing a new connection to the database.

    Parameters:
        db (str): The path of the database to connect to.
        isuri (bool): Indicates whether the database path is a URI or not.

    Returns:
        bool: True if the connection is successfully established, otherwise returns an error message.
    """
    try:
        global conn
        if conn == None:
            conn = sqlite3.connect(db, uri=isuri)
            conn.row_factory = sqlite3.Row
            return True
        else:
            conn.close()
            conn = sqlite3.connect(db, uri=isuri)
            conn.row_factory = sqlite3.Row
            return True
    except Exception as e:
        return "Error: " + str(e)

def executeQuery(sql: str, values: list):
    """
    Executes an SQL query on the database connection.

    Parameters:
        sql (str): The SQL query to execute.
        values (list): The list of values to bind to the query.

    Returns:
        bool: True if the query was executed successfully, otherwise an error message.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            values = encodebytes(values)
            conn.execute(sql, values)
            conn.commit()
            return True
        
        else:
            conn.execute(sql)
            conn.commit()
            return True
        
    except Exception as e:
        return "Error: " + str(e)

def fetchall(sql: str, values: list):
    """
    Fetches all rows from the database that match the given SQL query and values.

    Args:
        sql (str): The SQL query to execute.
        values (list): The list of values to bind to the query.

    Returns:
        list: A list of dictionaries representing the fetched rows. Each dictionary contains the column names as keys and their corresponding values.
        str: If an error occurs during the execution of the query, a string with the error message is returned.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            values = encodebytes(values)
            return [decodebytes(dict(i)) for i in conn.execute(sql, values).fetchall()]
        
        else:
            return [decodebytes(dict(i)) for i in conn.execute(sql).fetchall()]
        
    except Exception as e:
        return "Error: " + str(e)

def fetchone(sql: str, values: list):
    """
    Fetches a single row from the database that matches the given SQL query and values.

    Args:
        sql (str): The SQL query to execute.
        values (list): The list of values to bind to the query.

    Returns:
        dict: A dictionary representing the fetched row. The dictionary contains the column names as keys and their corresponding values.
        str: If an error occurs during the execution of the query, a string with the error message is returned.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            values = encodebytes(values)
            return decodebytes(dict(conn.execute(sql, values).fetchone()))
        
        else:
            return decodebytes(dict(conn.execute(sql).fetchone()))
        
    except Exception as e:
        return "Error: " + str(e)

def fetchmany(sql: str, size: int, values: list):
    """
    Fetches multiple rows from the database that match the given SQL query and values.

    Args:
        sql (str): The SQL query to execute.
        size (int): The number of rows to fetch.
        values (list): The list of values to bind to the query.

    Returns:
        list: A list of dictionaries representing the fetched rows. Each dictionary contains the column names as keys and their corresponding values.
        str: If an error occurs during the execution of the query, a string with the error message is returned.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            values = encodebytes(values)
            return [decodebytes(dict(i)) for i in conn.execute(sql, values).fetchmany(size)]

        else:
            return [decodebytes(dict(i)) for i in conn.execute(sql).fetchmany(size)]
        
    except Exception as e:
        return "Error: " + str(e)

def executeMany(sql: str, values: list):
    """
    Executes a SQL query with multiple sets of values on the database connection.

    Args:
        sql (str): The SQL query to execute.
        values (list): A list of lists containing the values to bind to the query.

    Returns:
        bool: True if the query was executed successfully, False otherwise.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.

    Note:
        The values parameter should be a list of lists, where each inner list contains the values for a single row.

    Example:
        executeMany("INSERT INTO table (column1, column2) VALUES (?, ?)", [[value1, value2], [value3, value4]])
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")

        for i in range(0, values.__len__()):
            values[i] = encodebytes(values[i])
        conn.executemany(sql, (values))
        conn.commit()
        return True

    except Exception as e:
        return "Error: " + str(e)

def executeScript(sqlScript: str):
    """
    Executes a SQL script on the database connection.

    Args:
        sqlScript (str): The path to the SQL script file.

    Returns:
        bool or str: True if the script was executed successfully, otherwise an error message.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        with open(sqlScript, "r") as sql_file:
            sql = sql_file.read()

        conn.executescript(sql)
        conn.commit()
        return True

    except Exception as e:
        try:
            if conn == None:
                raise ConnectionNotSetUpException("Connection not set up")
            conn.executescript(sqlScript)
            conn.commit()
            return True
        except Exception as e:
            return "Error: " + str(e)

def load_extension(name: str):
    """
    This function loads an extension into the database.

    Args:
        name (str): The name of the extension to load.

    Returns:
        bool or str: True if the extension is loaded successfully, otherwise a string containing the error message.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        conn.enable_load_extension(True)
        conn.load_extension(name)
        conn.enable_load_extension(False)
        return True

    except Exception as e:
        return "Error: " + str(e)

def backup(target: str, pages: int, name: str, sleep: int):
    """
    This function creates a backup of the database.

    Args:
        target (str): The database connection to save the backup to.
        pages (int): The number of pages to copy at a time. If equal to or less than 0, the entire database is copied in a single step. Defaults to -1.
        name (str): The name of the database to back up. Either "main" (the default) for the main database, "temp" for the temporary database, or the name of a custom database as attached using the ATTACH DATABASE SQL statement.
        sleep (float): The number of seconds to sleep between successive attempts to back up remaining pages.

    Returns:
        bool or str: True if the backup is created successfully, otherwise a string containing the error message.

    Raises:
        ConnectionNotSetUpException: If the database connection is not set up.
    """

    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        dst  = sqlite3.connect(target)
        
        conn.backup(dst, pages=pages, name=name, sleep=sleep)
        dst.close()
        return True

    except Exception as e:
        return "Error: " + str(e)

def main():
    """
    The main driver function reading from the input send by nodejs process and executing the sql queries on the database returning the data in JSON format.

    This function reads lines of input from the standard input, processes them, and writes the results to the standard output in JSON format. The input lines are expected to be in the form of a JSON array with the first element being the command name and the remaining elements being the arguments for the command.

    The supported commands are:
    - "newConnection": Creates a new database connection.
    - "executeQuery": Executes an SQL query on the database.
    - "fetchAll": Fetches all rows from the result of an executed SQL query.
    - "fetchMany": Fetches a number of rows from the result of an executed SQL query.
    - "fetchOne": Fetches a single row from the result of an executed SQL query.
    - "executeMany": Executes an SQL query with multiple sets of parameters.
    - "executeScript": Executes an SQL script file.
    - "load_extension": Loads an SQL extension into the database.
    - "backup": Creates a backup of the database.

    The function reads lines of input from the standard input until it encounters a newline character. It then processes the input line by parsing it as a JSON array and executing the corresponding command
    """
    while True:
        line = []
        while True:
            lines = sys.stdin.read(1)
            line.append(lines)
            if lines == "\n":
                break
        a = "".join([str(item) for item in line])
        nodesdtin = json.loads(a)
        if nodesdtin[0] == "newConnection":
            sys.stdout.write(f"{json.dumps(newConnection(nodesdtin[1], nodesdtin[2]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "executeQuery":
            sys.stdout.write(f"{json.dumps(executeQuery(nodesdtin[1], nodesdtin[2]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "fetchall":
            sys.stdout.write(f"{json.dumps(fetchall(nodesdtin[1], nodesdtin[2]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "fetchmany":
            sys.stdout.write(f"{json.dumps(fetchmany(nodesdtin[1], nodesdtin[2], nodesdtin[3]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "fetchone":
            sys.stdout.write(f"{json.dumps(fetchone(nodesdtin[1], nodesdtin[2]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "executeMany":
            sys.stdout.write(f"{json.dumps(executeMany(nodesdtin[1], nodesdtin[2]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "executeScript":
            sys.stdout.write(f"{json.dumps(executeScript(nodesdtin[1]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "load_extension":
            sys.stdout.write(f"{json.dumps(load_extension(nodesdtin[1]))}EOF")
            sys.stdout.flush()
        elif nodesdtin[0] == "backup":
            sys.stdout.write(f"{json.dumps(backup(nodesdtin[1], nodesdtin[2], nodesdtin[3], nodesdtin[4]))}EOF")
            sys.stdout.flush()
        else:
            sys.stdout.write(f"{json.dumps('Error: Invalid command')}EOF")
            sys.stdout.flush()


main()
