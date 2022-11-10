import { ChildProcess, exec, execFile } from "child_process";
import { dirname, join } from "path";

async () => {
  try {
    await import("electron");
  } catch (error) {}
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

const exitHandler = (options: { exit: boolean; cleanup: boolean }) => {
  if (options.cleanup) {
    if (process.platform === "win32") {
      exec(`taskkill /F /T /IM sqlite-win32-${process.arch}.exe`);
    } else if (process.platform === "linux") {
      exec(`killall -e sqlite-linux-${process.arch}`);
    }
  }
  if (options.exit) process.exit();
};

const setdbPath = (path: string): Promise<boolean> => {
  let dbPath: string = "";
  if (path === ":memory:") {
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
        `sqlite-${process.platform}-${process.arch}.exe`
      );
    } else {
      sqlitePath = join(
        __dirname,
        "..",
        `sqlite-${process.platform}-${process.arch}`
      );
    }
    sqlite = execFile(sqlitePath);
    if (sqlite !== null) {
      //Exit when app is closing
      process.on("exit", exitHandler.bind(null, { cleanup: true, exit: true }));

      //catches ctrl+c event
      process.on(
        "SIGINT",
        exitHandler.bind(null, { cleanup: true, exit: true })
      );

      // catches "kill pid" (for example: nodemon restart)
      process.on(
        "SIGUSR1",
        exitHandler.bind(null, { cleanup: true, exit: true })
      );
      process.on(
        "SIGUSR2",
        exitHandler.bind(null, { cleanup: true, exit: true })
      );

      //catches uncaught exceptions
      process.on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        exitHandler.bind(null, { cleanup: true, exit: false });
      });
    }
  }
  return new Promise<boolean>((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      sqlite.stdin.write(`${JSON.stringify(["newConnection", dbPath])}\n`);
      sqlite.stdout.on("data", (data) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          if (JSON.parse(string.split("EOF")[0]) === true) {
            resolve(true);
          }
          reject(JSON.parse(string.split("EOF")[0]));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const executeQuery = (
  Query: string,
  fetch?: string,
  values?: (string | number | null | Buffer)[]
): Promise<boolean | []> => {
  return new Promise<boolean | []>((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      sqlite.stdout.on("data", (data) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          resolve(JSON.parse(string.split("EOF")[0]));
        }
      });

      sqlite.stdin.write(
        `${JSON.stringify(["executeQuery", Query, fetch, values])}\n`
      );
    } catch (error) {
      reject(error);
    }
  });
};

const executeMany = (
  Query: string,
  v: (string | number | null | Buffer)[]
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      sqlite.stdout.on("data", (data) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          resolve(JSON.parse(string.split("EOF")[0]));
        }
      });

      sqlite.stdin.write(JSON.stringify(["executeMany", Query, v]));
    } catch (error) {
      reject(error);
    }
  });
};

const executeScript = (scriptName: string): Promise<Boolean> => {
  return new Promise<Boolean>((resolve, reject) => {
    try {
      if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
        return reject("Sqlite not defined");
      }
      let string = "";
      sqlite.stdout.on("data", (data) => {
        string += data.toString();
        if (string.substring(string.length - 3) === "EOF") {
          resolve(JSON.parse(string.split("EOF")[0]));
        }
      });

      sqlite.stdin.write(JSON.stringify(["executeScript", scriptName]));
    } catch (error) {
      reject(error);
    }
  });
};

export { setdbPath, executeQuery, executeMany, executeScript };
