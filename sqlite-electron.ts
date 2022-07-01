import { execFile } from 'child_process';
import { dirname, join } from 'path';
import 'electron';

const electronNodeDetection = (): string => {
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        if (process.defaultApp) {
            return join(dirname(require.main.filename), module.exports.dbPath);
        } else {
            return join(dirname(process.execPath), module.exports.dbPath);
        }
    } else {
        return join(dirname(require.main.filename), module.exports.dbPath);
    }
}

const executeQuery = (Query: string, fetch?: string, values?: (string | number | null | Buffer)[]): Promise<boolean | []> => {
    return new Promise<boolean | []>((resolve, reject) => {
        try {

            const fullpath = electronNodeDetection();

            let sqlitePath = ''

            if (process.platform === 'win32') {
                sqlitePath = join(__dirname, `sqlite-${process.platform}-${process.arch}.exe`)
            }else {
                sqlitePath = join(__dirname, `sqlite-${process.platform}-${process.arch}`)
            }
            const sqlite = execFile(sqlitePath);

            let string = '';

            sqlite.stdin.write(JSON.stringify(['executeQuery', fullpath, Query, fetch, values]));
            sqlite.stdin.end();

            sqlite.stdout.on('data', (data) => {
                string += data.toString();
            });

            sqlite.stdout.on('end', () => {
                sqlite.kill();
                resolve(JSON.parse(string));
            });
        } catch (error) {
            reject(error);
        }
    });
}

const executeMany = (Query: string, v: (string | number | null | Buffer)[]): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        try {

            const fullpath = electronNodeDetection()

            let sqlitePath = ''

            if (process.platform === 'win32') {
                sqlitePath = join(__dirname, `sqlite-${process.platform}-${process.arch}.exe`)
            }else {
                sqlitePath = join(__dirname, `sqlite-${process.platform}-${process.arch}`)
            }
            const sqlite = execFile(sqlitePath);
        
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

const executeScript = (scriptName: string): Promise<Boolean> => {
    return new Promise<Boolean>((resolve, reject) => {
        try {

            const fullpath = electronNodeDetection()

            let sqlitePath = ''

            if (process.platform === 'win32') {
                sqlitePath = join(__dirname, `sqlite-${process.platform}-${process.arch}.exe`)
            }else {
                sqlitePath = join(__dirname, `sqlite-${process.platform}-${process.arch}`)
            }
            const sqlite = execFile(sqlitePath);
        
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
