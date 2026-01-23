import { ChildProcess, execFile } from "child_process";
import { join } from "path";
import { Type } from "typescript";

let sqlite: ChildProcess | null = null;

const exitHandler = () => {
  if (sqlite !== null) {
    sqlite.kill();
  }
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
    sqlite = execFile(pyPath, [sqliteFilePath], { maxBuffer: 10 * 1024 * 1024 });
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
      sqlite.stdin.write(`${JSON.stringify(["newConnection", path, isuri, autocommit])}\n`);
    } catch (error) {
      reject(error);
    }
  });
};

const executeQuery = async (
  query: string,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
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

      if (Array.isArray(values)) {
        for (let i = 0; i < values.length; i++) {
          if (Buffer.isBuffer(values[i])) {
            values[i] = JSON.stringify(values[i]);
          }
        }
      } else {
        const payloadValues = { ...values };

        for (const key in payloadValues) {
          if (Buffer.isBuffer(payloadValues[key])) {
            payloadValues[key] = JSON.stringify(payloadValues[key]);
          }
        }
      }
      sqlite.stdin.write(
        `${JSON.stringify(["executeQuery", query, values])}\n`
      );
    } catch (error) {
      reject(error);
    }
  });
};

const fetchAll = async (
  query: string,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
): Promise<Array<Type>> => {
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

      if (Array.isArray(values)) {
        for (let i = 0; i < values.length; i++) {
          if (Buffer.isBuffer(values[i])) {
            values[i] = JSON.stringify(values[i]);
          }
        }
      } else {
        const payloadValues = { ...values };

        for (const key in payloadValues) {
          if (Buffer.isBuffer(payloadValues[key])) {
            payloadValues[key] = JSON.stringify(payloadValues[key]);
          }
        }
      }
      sqlite.stdin.write(`${JSON.stringify(["fetchall", query, values])}\n`);
    } catch (error) {
      reject(error);
    }
  });
};

const fetchOne = async (
  query: string,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
): Promise<Type> => {
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

      if (Array.isArray(values)) {
        for (let i = 0; i < values.length; i++) {
          if (Buffer.isBuffer(values[i])) {
            values[i] = JSON.stringify(values[i]);
          }
        }
      } else {
        const payloadValues = { ...values };

        for (const key in payloadValues) {
          if (Buffer.isBuffer(payloadValues[key])) {
            payloadValues[key] = JSON.stringify(payloadValues[key]);
          }
        }
      }
      sqlite.stdin.write(`${JSON.stringify(["fetchone", query, values])}\n`);
    } catch (error) {
      reject(error);
    }
  });
};

const fetchMany = async (
  query: string,
  size: number,
  values: Array<string | number | null | Buffer> | Record<string, string | number | null | Buffer> = []
): Promise<Array<Type>> => {
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

      if (Array.isArray(values)) {
        for (let i = 0; i < values.length; i++) {
          if (Buffer.isBuffer(values[i])) {
            values[i] = JSON.stringify(values[i]);
          }
        }
      } else {
        const payloadValues = { ...values };

        for (const key in payloadValues) {
          if (Buffer.isBuffer(payloadValues[key])) {
            payloadValues[key] = JSON.stringify(payloadValues[key]);
          }
        }
      }
      sqlite.stdin.write(
        `${JSON.stringify(["fetchmany", query, size, values])}\n`
      );
    } catch (error) {
      reject(error);
    }
  });
};

const executeMany = async (
  query: string,
  values: Array<Array<string | number | null | Buffer>> | Array<Record<string, string | number | null | Buffer>>
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
      for (let j = 0; j < values.length; j++) {
        const v = values[j];
        if (Array.isArray(v)) {
          for (let i = 0; i < v.length; i++) {
            if (Buffer.isBuffer(v[i])) {
              v[i] = JSON.stringify(v[i]);
            }
          }
        } else {
          const payloadValues = { ...v };

          for (const key in payloadValues) {
            if (Buffer.isBuffer(payloadValues[key])) {
              payloadValues[key] = JSON.stringify(payloadValues[key]);
            }
          }
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

const load_extension = async (path: string): Promise<Boolean> => {
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
      sqlite.stdin.write(`${JSON.stringify(["load_extension", path])}\n`);
    } catch (error) {
      reject(error);
    }
  });
};

const backup = async (target: string, pages: number = -1, name: string = "main", sleep: number = 0.250): Promise<Boolean> => {
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
      sqlite.stdin.write(`${JSON.stringify(["backup", target, pages, name, sleep])}\n`);
    } catch (error) {
      reject(error);
    }
  });
}

const iterdump = async (file: string, filter: string = null): Promise<Boolean> => {
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
      sqlite.stdin.write(`${JSON.stringify(["iterdump", file, filter])}\n`);
    } catch (error) {
      reject(error);
    }
  });
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
