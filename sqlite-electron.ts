import { ChildProcess, execFile } from "child_process";
import { dirname, join } from "path";
import { Type } from "typescript";

async () => {
  try {
    await import("electron");
  } catch (error) { }
};

let sqlite: ChildProcess | null = null;

const electronNodeDetection = (path: string): string => {
  if (
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!process.versions.electron &&
    require.main !== undefined
  ) {
    if (process.defaultApp) {
      return join(dirname(require.main.filename), path);
    } else {
      return join(dirname(process.execPath), path);
    }
  } else {
    if (require.main !== undefined) {
      return join(dirname(require.main.filename), path);
    } else {
      throw new Error("Cannot set path");
    }
  }
};

const exitHandler = () => {
  if (sqlite !== null) {
    sqlite.kill();
  }
};

const setdbPath = async (path: string, isuri = false): Promise<boolean> => {
  let dbPath: string = "";
  if (path === ":memory:") {
    dbPath = path;
  } else if (isuri) {
    dbPath = path;
  } else {
    dbPath = electronNodeDetection(path);
  }
  if (sqlite === null) {
    let sqlitePath = "";
    if (process.platform === "win32") {
      sqlitePath = join(
        __dirname,
        "..",
        `sqlite-${process.platform}-${process.arch}`,
        `sqlite-${process.platform}-${process.arch}.exe`
      );
    } else {
      sqlitePath = join(
        __dirname,
        "..",
        `sqlite-${process.platform}-${process.arch}`,
        `sqlite-${process.platform}-${process.arch}`
      );
    }
    sqlite = execFile(sqlitePath, { maxBuffer: 10 * 1024 * 1024 });
    if (sqlite !== null) {
      //Exit when app is closing
      process.on("exit", exitHandler.bind(null));

      //catches ctrl+c event
      process.on("SIGINT", exitHandler.bind(null));

      // catches "kill pid" (for example: nodemon restart)
      process.on("SIGUSR1", exitHandler.bind(null));
      process.on("SIGUSR2", exitHandler.bind(null));

      //catches uncaught exceptions
      process.on("uncaughtException", () => {
        exitHandler.bind(null);
      });
    }
  }
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          resolve(JSON.parse(string.split("EOF")[0]));
          sqlite.stdout.off("data", onData);
        }
      };
      sqlite.stdout.on("data", onData);
      sqlite.stdin.write(
        `${JSON.stringify(["newConnection", dbPath, isuri])}\n`,
      );
    } catch (error) {
      reject(error);
    }
  });
};

const executeQuery = async (
  query: string,
  values: Array<string | number | null | Buffer> = []
): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          resolve(JSON.parse(string.split("EOF")[0]));
          sqlite.stdout.off("data", onData);
        }
      };

      sqlite.stdout.on("data", onData);
      for (let i = 0; i < values.length; i++) {
        if (!Buffer.isBuffer(values[i])) {
          continue;
        }
        values[i] = JSON.stringify(values[i]);
      }
      sqlite.stdin.write(
        `${JSON.stringify(["executeQuery", query, values])}\n`,
      );
    } catch (error) {
      reject(error);
    }
  });
};

const fetchAll = async (query: string, values: Array<string | number | null | Buffer> = []): Promise<Array<Type>> => {
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          const d = JSON.parse(string.split("EOF")[0]);
          for (let i = 0; i < d.length; i++) {
            const de = d[i];
            Object.keys(de).forEach((i) => {
              const element = de[i];
              if (
                typeof element === "object" &&
                !Array.isArray(element) &&
                element !== null &&
                element.type == "Buffer" &&
                Array.isArray(element.data)
              ) {
                de[i] = Buffer.from(element.data);
              }
            });
          }
          if (string.startsWith('"Error: ')) {
            reject(d);
          } else {
            resolve(d);
          }
          sqlite.stdout.off("data", onData);
        }
      };

      sqlite.stdout.on("data", onData);
      for (let i = 0; i < values.length; i++) {
        if (!Buffer.isBuffer(values[i])) {
          continue;
        }
        values[i] = JSON.stringify(values[i]);
      }
      sqlite.stdin.write(
        `${JSON.stringify(["fetchall", query, values])}\n`,
      );
    } catch (error) {
      reject(error);
    }
  });
}

const fetchOne = async (query: string, values: Array<string | number | null | Buffer> = []): Promise<Type> => {
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          const d = JSON.parse(string.split("EOF")[0]);
          Object.keys(d).forEach((key) => {
            const element = d[key];
            if (
              typeof element === "object" &&
              !Array.isArray(element) &&
              element !== null &&
              element.type == "Buffer" &&
              Array.isArray(element.data)
            ) {
              d[key] = Buffer.from(element.data);
            }
          });
          if (string.startsWith('"Error: ')) {
            reject(d);
          } else {
            resolve(d);
          }
          sqlite.stdout.off("data", onData);
        }
      };

      sqlite.stdout.on("data", onData);
      for (let i = 0; i < values.length; i++) {
        if (!Buffer.isBuffer(values[i])) {
          continue;
        }
        values[i] = JSON.stringify(values[i]);
      }
      sqlite.stdin.write(
        `${JSON.stringify(["fetchone", query, values])}\n`,
      );
    } catch (error) {
      reject(error);
    }
  });
}

const fetchMany = async (query: string, size: number, values: Array<string | number | null | Buffer> = []): Promise<Array<Type>> => {
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          const d = JSON.parse(string.split("EOF")[0]);
          for (let i = 0; i < d.length; i++) {
            const de = d[i];
            Object.keys(de).forEach((i) => {
              const element = de[i];
              if (
                typeof element === "object" &&
                !Array.isArray(element) &&
                element !== null &&
                element.type == "Buffer" &&
                Array.isArray(element.data)
              ) {
                de[i] = Buffer.from(element.data);
              }
            });
          }
          if (string.startsWith('"Error: ')) {
            reject(d);
          } else {
            resolve(d);
          }
          sqlite.stdout.off("data", onData);
        }
      };

      sqlite.stdout.on("data", onData);
      for (let i = 0; i < values.length; i++) {
        if (!Buffer.isBuffer(values[i])) {
          continue;
        }
        values[i] = JSON.stringify(values[i]);
      }
      sqlite.stdin.write(
        `${JSON.stringify(["fetchmany", query, size, values])}\n`,
      );
    } catch (error) {
      reject(error);
    }
  });
}

const executeMany = async (
  query: string,
  values: Array<Array<string | number | null | Buffer>>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          resolve(JSON.parse(string.split("EOF")[0]));
          sqlite.stdout.off("data", onData);
        }
      };

      sqlite.stdout.on("data", onData);
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
          if (!Buffer.isBuffer(values[i][j])) {
            continue;
          }
          values[i][j] = JSON.stringify(values[i][j]);
        }
      }
      sqlite.stdin.write(`${JSON.stringify(["executeMany", query, values])}\n`);
    } catch (error) {
      reject(error);
    }
  });
};

const executeScript = async (scriptname: string): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      const onData = (data: Buffer) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          resolve(JSON.parse(string.split("EOF")[0]));
          sqlite.stdout.off("data", onData);
        }
      };

      sqlite.stdout.on("data", onData);
      sqlite.stdin.write(`${JSON.stringify(["executeScript", scriptname])}\n`);
    } catch (error) {
      reject(error);
    }
  });
};

export { setdbPath, executeQuery, fetchOne, fetchMany, fetchAll, executeMany, executeScript };