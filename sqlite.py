"""
sqlite-electorn server executing the sql queries of the nodejs/electron processes
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
"""

import sys, json, sqlite3

conn = None


def newConnection(db):
    """
    This is an Internal function used to connect to the database specified by the nodejs Process
    It takes the path of the database as parameter and returns true on connecting or returns error on exception
    """
    try:
        global conn
        if conn == None:
            conn = sqlite3.connect(db)
            return True
        else:
            conn.close()
            conn = sqlite3.connect(db)
            return True
    except Exception as e:
        return "Error: " + str(e)


def executeQuery(sql, fetch, values):
    """
    This the function for executing the queries sent by the nodejs process and return true or arrays or error on exceptions
    """
    try:
        if conn == None:
            raise "Connection not set up"
        if fetch == "all":
            if type(values) is not list or values == []:
                cursor = conn.execute(sql)
                data = cursor.fetchall()
                cursor.close()
                return data
            else:
                cursor = conn.execute(sql, (values))
                data = cursor.fetchall()
                conn.commit()
                cursor.close()
                return data

        if fetch == "1":
            if type(values) is not list or values == []:
                cursor = conn.execute(sql)
                data = cursor.fetchone()
                cursor.close()
                return data
            else:
                cursor = conn.execute(sql, (values))
                data = cursor.fetchone()
                conn.commit()
                cursor.close()
                return data

        if fetch == "":
            if type(values) is not list or values == []:
                cursor = conn.execute(sql)
                cursor.close()
                return True
            else:
                cursor = conn.execute(sql, (values))
                conn.commit()
                cursor.close()
                return True

        else:
            if type(values) is not list or values == []:
                cursor = conn.execute(sql)
                data = cursor.fetchmany(int(fetch))
                cursor.close()
                return data
            else:
                cursor = conn.execute(sql, (values))
                data = cursor.fetchmany(int(fetch))
                conn.commit()
                cursor.close()
                return data

    except Exception as e:
        return "Error: " + str(e)


def executeMany(sql, values):
    """
    This function executes single query on multiple value arrays return true or return error on exception
    """
    try:
        if conn == None:
            raise "Connection not set up"
        conn.executemany(sql, (values))
        conn.commit()
        return True

    except Exception as e:
        return "Error: " + str(e)


def executeScript(sqlScript):
    """
    This function executes sql scripts and returns true on success or error on exception
    """
    try:
        if conn == None:
            raise "Connection not set up"
        with open(sqlScript, "r") as sql_file:
            sql = sql_file.read()

        conn.executescript(sql)
        conn.commit()
        return True

    except Exception as e:
        try:
            if conn == None:
                raise "Connection not set up"
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
        a: str = "".join([str(item) for item in line])
        why = json.loads(a)
        if why[0] == "newConnection":
            sys.stdout.write(f"{json.dumps(newConnection(why[1]))}EOF")
            sys.stdout.flush()
        elif why[0] == "executeQuery":
            sys.stdout.write(f"{json.dumps(executeQuery(why[1], why[2], why[3]))}EOF")
            sys.stdout.flush()
        elif why[0] == "executeMany":
            sys.stdout.write(f"{json.dumps(executeMany(why[1], why[2]))}EOF")
            sys.stdout.flush()
        elif why[0] == "executeScript":
            sys.stdout.write(f"{json.dumps(executeScript(why[1]))}EOF")
            sys.stdout.flush()


main()
