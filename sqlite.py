'''
sqlite-electorn server executing the sql queries of the nodejs/electron processes
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
'''

import sys, json, sqlite3

def connect(db):
    '''
    This is an Internal function used to connect to the database specified by the nodejs Process
    It takes the path of the database as parameter and returns true on connecting or returns error on exception
    '''
    try:
        conn = sqlite3.connect(db)
        return conn
    except Exception as e:
        return 'Error: ' + str(e)

def executeQuery(db, sql, fetch, values):
    '''
    This the function for executing the queries sent by the nodejs process and return true or arrays or error on exceptions
    '''
    conn = connect(db)
    try:
        if fetch == 'all':
            if values == []:
                cursor = conn.execute(sql)
                data = cursor.fetchall()
                conn.commit()
                conn.close()
                return data
            else:
                cursor = conn.execute(sql, (values))
                data = cursor.fetchall()
                conn.commit()
                conn.close()
                return data

        if fetch == '1':
            if values == []:
                cursor = conn.execute(sql)
                data = cursor.fetchone()
                conn.commit()
                conn.close()
                return data
            else:
                cursor = conn.execute(sql, (values))
                data = cursor.fetchone()
                conn.commit()
                conn.close()
                return data

        if fetch == '':
            if values == []:
                cursor = conn.execute(sql)
                conn.commit()
                conn.close()
                return True
            else:
                cursor = conn.execute(sql, (values))
                conn.commit()
                conn.close()
                return True

        else:
            if values == []:
                cursor = conn.execute(sql)
                data = cursor.fetchmany(int(fetch))
                conn.commit()
                conn.close()
                return data
            else:
                cursor = conn.execute(sql, (values))
                data = cursor.fetchmany(int(fetch))
                conn.commit()
                conn.close()
                return data

    except Exception as e:
        return 'Error: ' + str(e)


def executeMany(db, sql, values):
    '''
    This function executes single queries on multiple value arrays return true or return error on exception
    '''
    conn = connect(db)
    try:
        conn.executemany(sql, (values))
        conn.commit()
        conn.close()
        return True

    except Exception as e:
        return 'Error: ' + str(e)


def executeScript(db, sqlScript):
    '''
    This function executes sql scripts and returns true on success or error on exception
    '''
    conn = connect(db)
    try:
        with open(sqlScript, 'r') as sql_file:
            sql = sql_file.read()

        conn.executescript(sql)
        conn.commit()
        conn.close()
        return True

    except Exception as e:
        return 'Error: ' + str(e)

def main():
    '''
    The main driver function reading from the input send by nodejs process and executing the sql queries on the database returning the data in JSON format
    '''
    lines = sys.stdin.readlines()
    why = json.loads(lines[0])
    if why[0] == 'executeQuery':
      print(json.dumps(executeQuery(why[1], why[2], why[3], why[4])))
    elif why[0] == 'executeMany':
        print(json.dumps(executeMany(why[1], why[2], why[3])))
    elif why[0] == 'executeScript':
        print(json.dumps(executeScript(why[1], why[2])))

main()