import { ChildProcess, execFile } from "child_process";
import { join } from "path";

let sqlite: ChildProcess | null = null;

const exitHandler = () => {
  if (sqlite !== null) {
    sqlite.kill();
  }
};

const deserializeBuffers = (data: any): any => {
  if (data === null || typeof data !== "object") return data;

  if (data.type === "Buffer" && Array.isArray(data.data)) {
    return Buffer.from(data.data);
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = deserializeBuffers(data[i]);
    }
  } else {
    for (const key in data) {
      data[key] = deserializeBuffers(data[key]);
    }
  }
  return data;
};

const serializeValues = (values: any) => {
  if (Array.isArray(values)) {
    for (let i = 0; i < values.length; i++) {
      if (Buffer.isBuffer(values[i])) {
        values[i] = JSON.stringify(values[i]);
      } else if (typeof values[i] === "object" && values[i] !== null) {
        const v = values[i];
        if (Array.isArray(v)) {
          for (let j = 0; j < v.length; j++) {
            if (Buffer.isBuffer(v[j])) {
              v[j] = JSON.stringify(v[j]);
            }
          }
        } else {
          for (const key in v) {
            if (Buffer.isBuffer(v[key])) {
              v[key] = JSON.stringify(v[key]);
            }
          }
        }
      }
    }
  } else if (typeof values === "object" && values !== null) {
    for (const key in values) {
      if (Buffer.isBuffer(values[key])) {
        values[key] = JSON.stringify(values[key]);
      }
    }
  }
};

const sendCommand = <T>(commandData: any[]): Promise<T> => {
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null || sqlite.stderr === null) {
        return reject("Sqlite not defined");
      }
      let string = "";

      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          cleanup();
          const jsonString = string.slice(0, string.length - 3);
          if (jsonString.startsWith('"Error: ')) {
            return reject(JSON.parse(jsonString));
          }
          try {
            const parsed = JSON.parse(jsonString);
            resolve(deserializeBuffers(parsed));
          } catch (e) {
            reject(e);
          }
        }
      };

      const onErrData = (data: Buffer) => {
        cleanup();
        reject(data.toString());
      };

      const cleanup = () => {
        if (sqlite && sqlite.stdout) sqlite.stdout.off("data", onData);
        if (sqlite && sqlite.stderr) sqlite.stderr.off("data", onErrData);
      };

      sqlite.stderr.once("data", onErrData);
      sqlite.stdout.on("data", onData);
      sqlite.stdin.write(`${JSON.stringify(commandData)}\n`);
    } catch (error) {
      reject(error);
    }
  });
};

const setdbPath = async (path: string, isuri = false, autocommit = true): Promise<boolean> => {
  if (sqlite === null) {
    const sqliteFilePath = join(__dirname, "..", "sqlite.py");
    let pyPath = "";
    if (process.platform === "win32") {
      pyPath = join(
        __dirname,
        "..",
        'python',
        'python.exe'
      );
    } else {
      pyPath = join(
        __dirname,
        "..",
        'python',
        'bin',
        'python'
      );
    }
    sqlite = execFile(pyPath, [sqliteFilePath], { maxBuffer: 10 * 1024 * 1024, shell: false });
    if (sqlite !== null) {
      //Exit when app is closing
      process.once("exit", exitHandler.bind(null));

      //catches ctrl+c event
      process.once("SIGINT", exitHandler.bind(null));

      // catches "kill pid" (for example: nodemon restart)
      process.once("SIGUSR1", exitHandler.bind(null));
      process.once("SIGUSR2", exitHandler.bind(null));

      //catches uncaught exceptions
      process.once("uncaughtException", exitHandler.bind(null));
    }
  }
  return sendCommand<boolean>(["newConnection", path, isuri, autocommit]);
};

const executeQuery = async (
  query: string,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
): Promise<boolean> => {
  serializeValues(values);
  return sendCommand<boolean>(["executeQuery", query, values]);
};

const fetchAll = async <T>(
  query: string,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
): Promise<Array<T>> => {
  serializeValues(values);
  return sendCommand<Array<T>>(["fetchall", query, values]);
};

const fetchOne = async <T>(
  query: string,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
): Promise<T> => {
  serializeValues(values);
  return sendCommand<T>(["fetchone", query, values]);
};

const fetchMany = async <T>(
  query: string,
  size: number,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
): Promise<Array<T>> => {
  serializeValues(values);
  return sendCommand<Array<T>>(["fetchmany", query, size, values]);
};

const executeMany = async (
  query: string,
  values: Array<Array<string | number | null | Buffer>> | Array<Record<string, string | number | null | Buffer>>
): Promise<boolean> => {
  serializeValues(values);
  return sendCommand<boolean>(["executeMany", query, values]);
};

const executeScript = async (scriptname: string): Promise<boolean> => {
  return sendCommand<boolean>(["executeScript", scriptname]);
};

const load_extension = async (path: string, entrypoint: string | null = null): Promise<boolean> => {
  return sendCommand<boolean>(["load_extension", path, entrypoint]);
};

const backup = async (target: string, pages: number = -1, name: string = "main", sleep: number = 0.250): Promise<boolean> => {
  return sendCommand<boolean>(["backup", target, pages, name, sleep]);
}

const iterdump = async (file: string, filter: string | null = null): Promise<boolean> => {
  return sendCommand<boolean>(["iterdump", file, filter]);
}

export {
  setdbPath,
  executeQuery,
  fetchOne,
  fetchMany,
  fetchAll,
  executeMany,
  executeScript,
  load_extension,
  backup,
  iterdump,
};
