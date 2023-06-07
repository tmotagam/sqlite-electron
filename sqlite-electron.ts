import { ChildProcess, execFile } from "child_process";
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

const exitHandler = () => {
  if (sqlite !== null) {
    sqlite.kill();
  }
};

const setdbPath = async (path: string): Promise<boolean> => {
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
    sqlite = execFile(sqlitePath);
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
  if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
    throw "Sqlite not defined";
  }
  let string = "";
  sqlite.stdin.write(`${JSON.stringify(["newConnection", dbPath])}\n`);
  for await (const chunk of sqlite.stdout) {
    string += chunk;
    if (string.substring(string.length - 3) === "EOF") {
      break;
    }
  }
  if (JSON.parse(string.split("EOF")[0]) === true) {
    return true;
  }
  throw JSON.parse(string.split("EOF")[0]);
};

const executeQuery = async (
  Query: string,
  fetch: string = "",
  values: Array<string | number | null | Buffer> = []
): Promise<Boolean | Array<any> | Array<Array<any>>> => {
  if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
    throw "Sqlite not defined";
  }
  let string = "";

  if (values !== undefined) {
    const l = values.length;
    for (let i = 0; i < l; i++) {
      if (!Buffer.isBuffer(values[i])) {
        continue;
      }
      values[i] = JSON.stringify(values[i]);
    }
  }

  sqlite.stdin.write(
    `${JSON.stringify(["executeQuery", Query, fetch, values])}\n`
  );
  for await (const chunk of sqlite.stdout) {
    string += chunk;
    if (string.substring(string.length - 3) === "EOF") {
      break;
    }
  }
  const d = JSON.parse(string.split("EOF")[0]);
  if (typeof d !== "boolean") {
    if (Array.isArray(d[0])) {
      for (let i = 0; i < d.length; i++) {
        const de = d[i];
        for (let i = 0; i < de.length; i++) {
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
        }
      }
    } else {
      for (let i = 0; i < d.length; i++) {
        const element = d[i];
        if (
          typeof element === "object" &&
          !Array.isArray(element) &&
          element !== null &&
          element.type == "Buffer" &&
          Array.isArray(element.data)
        ) {
          d[i] = Buffer.from(element.data);
        }
      }
    }
  }
  if (string.startsWith('"Error: ')) {
    throw d;
  } else {
    return d;
  }
};

const executeMany = async (
  Query: string,
  v: Array<Array<string | number | null | Buffer>>
): Promise<boolean> => {
  if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
    throw "Sqlite not defined";
  }
  let string = "";

  const l = v.length;
  for (let i = 0; i < l; i++) {
    const sl = v[i].length;
    for (let j = 0; j < sl; j++) {
      if (!Buffer.isBuffer(v[i][j])) {
        continue;
      }
      v[i][j] = JSON.stringify(v[i][j]);
    }
  }
  sqlite.stdin.write(`${JSON.stringify(["executeMany", Query, v])}\n`);
  for await (const chunk of sqlite.stdout) {
    string += chunk;
    if (string.substring(string.length - 3) === "EOF") {
      break;
    }
  }
  if (JSON.parse(string.split("EOF")[0]) === true) {
    return true;
  }
  throw JSON.parse(string.split("EOF")[0]);
};

const executeScript = async (scriptName: string): Promise<Boolean> => {
  if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
    throw "Sqlite not defined";
  }
  let string = "";
  sqlite.stdin.write(`${JSON.stringify(["executeScript", scriptName])}\n`);
  for await (const chunk of sqlite.stdout) {
    string += chunk;
    if (string.substring(string.length - 3) === "EOF") {
      break;
    }
  }
  if (JSON.parse(string.split("EOF")[0]) === true) {
    return true;
  }
  throw JSON.parse(string.split("EOF")[0]);
};

export { setdbPath, executeQuery, executeMany, executeScript };
