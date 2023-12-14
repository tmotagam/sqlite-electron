"""
sqlite-electorn server executing the sql queries of the nodejs/electron processes
Copyright (C) 2020-2024  Motagamwala Taha Arif Ali

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
    for key, val in data.items():
        if type(val) is bytes:
            data[key] = {"type": "Buffer", "data": list(val)}
    return data

def newConnection(db: str, isuri: bool):
    """
    This is the function used to connect to the database specified by the nodejs Process
    It takes the path of the database as parameter and returns true on connecting or returns error on exception
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
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            for i, val in enumerate(values):
                try:
                    v = json.loads(val)
                    if type(v) is dict:
                        if "data" in v and "type" in v:
                            if v["type"] == "Buffer" and type(v["data"]) is list:
                                values[i] = array.array("B", v["data"])
                except Exception:
                    pass
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
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            for i, val in enumerate(values):
                try:
                    v = json.loads(val)
                    if type(v) is dict:
                        if "data" in v and "type" in v:
                            if v["type"] == "Buffer" and type(v["data"]) is list:
                                values[i] = array.array("B", v["data"])
                except Exception:
                    pass
            return [decodebytes(dict(i)) for i in conn.execute(sql, values).fetchall()]
        
        else:
            return [decodebytes(dict(i)) for i in conn.execute(sql).fetchall()]
        
    except Exception as e:
        return "Error: " + str(e)

def fetchone(sql: str, values: list):
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            for i, val in enumerate(values):
                try:
                    v = json.loads(val)
                    if type(v) is dict:
                        if "data" in v and "type" in v:
                            if v["type"] == "Buffer" and type(v["data"]) is list:
                                values[i] = array.array("B", v["data"])
                except Exception:
                    pass
            return decodebytes(dict(conn.execute(sql, values).fetchone()))
        
        else:
            return decodebytes(dict(conn.execute(sql).fetchone()))
        
    except Exception as e:
        return "Error: " + str(e)

def fetchmany(sql: str, size: int, values: list):
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")
        
        if not(not values):
            for i, val in enumerate(values):
                try:
                    v = json.loads(val)
                    if type(v) is dict:
                        if "data" in v and "type" in v:
                            if v["type"] == "Buffer" and type(v["data"]) is list:
                                values[i] = array.array("B", v["data"])
                except Exception:
                    pass
            return [decodebytes(dict(i)) for i in conn.execute(sql, values).fetchmany(size)]

        else:
            return [decodebytes(dict(i)) for i in conn.execute(sql).fetchmany(size)]
        
    except Exception as e:
        return "Error: " + str(e)

def executeMany(sql: str, values: list):
    """
    This function executes single query on multiple value arrays return true or return error on exception
    """
    try:
        if conn == None:
            raise ConnectionNotSetUpException("Connection not set up")

        for i in range(0, values.__len__()):
            for j in range(0, values[i].__len__()):
                try:
                    v = json.loads(values[i][j])
                    if type(v) is dict:
                        if "data" in v and "type" in v:
                            if v["type"] == "Buffer" and type(v["data"]) is list:
                                values[i][j] = array.array("B", v["data"])
                except Exception:
                    pass
        conn.executemany(sql, (values))
        conn.commit()
        return True

    except Exception as e:
        return "Error: " + str(e)


def executeScript(sqlScript: str):
    """
    This function executes sql scripts and returns true on success or error on exception
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


def main():
    """
    The main driver function reading from the input send by nodejs process and executing the sql queries on the database returning the data in JSON format
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


main()
