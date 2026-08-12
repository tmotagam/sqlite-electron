"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterdump = exports.backup = exports.load_extension = exports.executeScript = exports.executeMany = exports.fetchAll = exports.fetchMany = exports.fetchOne = exports.executeQuery = exports.setdbPath = void 0;
var child_process_1 = require("child_process");
var path_1 = require("path");
var sqlite = null;
var exitHandler = function () {
    if (sqlite !== null) {
        sqlite.kill();
    }
};
var deserializeBuffers = function (data) {
    if (data === null || typeof data !== "object")
        return data;
    if (data.type === "Buffer" && Array.isArray(data.data)) {
        return Buffer.from(data.data);
    }
    if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            data[i] = deserializeBuffers(data[i]);
        }
    }
    else {
        for (var key in data) {
            data[key] = deserializeBuffers(data[key]);
        }
    }
    return data;
};
var serializeValues = function (values) {
    if (Array.isArray(values)) {
        for (var i = 0; i < values.length; i++) {
            if (Buffer.isBuffer(values[i])) {
                values[i] = JSON.stringify(values[i]);
            }
            else if (typeof values[i] === "object" && values[i] !== null) {
                var v = values[i];
                if (Array.isArray(v)) {
                    for (var j = 0; j < v.length; j++) {
                        if (Buffer.isBuffer(v[j])) {
                            v[j] = JSON.stringify(v[j]);
                        }
                    }
                }
                else {
                    for (var key in v) {
                        if (Buffer.isBuffer(v[key])) {
                            v[key] = JSON.stringify(v[key]);
                        }
                    }
                }
            }
        }
    }
    else if (typeof values === "object" && values !== null) {
        for (var key in values) {
            if (Buffer.isBuffer(values[key])) {
                values[key] = JSON.stringify(values[key]);
            }
        }
    }
};
var sendCommand = function (commandData) {
    return new Promise(function (resolve, reject) {
        try {
            if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null || sqlite.stderr === null) {
                return reject("Sqlite not defined");
            }
            var string_1 = "";
            var onData_1 = function (data) {
                string_1 += data.toString();
                if (string_1.substring(string_1.length - 3) === "EOF") {
                    cleanup_1();
                    var jsonString = string_1.slice(0, string_1.length - 3);
                    if (jsonString.startsWith('"Error: ')) {
                        return reject(JSON.parse(jsonString));
                    }
                    try {
                        var parsed = JSON.parse(jsonString);
                        resolve(deserializeBuffers(parsed));
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            };
            var onErrData_1 = function (data) {
                cleanup_1();
                reject(data.toString());
            };
            var cleanup_1 = function () {
                if (sqlite && sqlite.stdout)
                    sqlite.stdout.off("data", onData_1);
                if (sqlite && sqlite.stderr)
                    sqlite.stderr.off("data", onErrData_1);
            };
            sqlite.stderr.once("data", onErrData_1);
            sqlite.stdout.on("data", onData_1);
            sqlite.stdin.write("".concat(JSON.stringify(commandData), "\n"));
        }
        catch (error) {
            reject(error);
        }
    });
};
var setdbPath = function (path_2) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([path_2], args_1, true), void 0, function (path, isuri, autocommit) {
        var sqliteFilePath, pyPath;
        if (isuri === void 0) { isuri = false; }
        if (autocommit === void 0) { autocommit = true; }
        return __generator(this, function (_a) {
            if (sqlite === null) {
                sqliteFilePath = (0, path_1.join)(__dirname, "..", "sqlite.py");
                pyPath = "";
                if (process.platform === "win32") {
                    pyPath = (0, path_1.join)(__dirname, "..", 'python', 'python.exe');
                }
                else {
                    pyPath = (0, path_1.join)(__dirname, "..", 'python', 'bin', 'python');
                }
                sqlite = (0, child_process_1.execFile)(pyPath, [sqliteFilePath], { maxBuffer: 10 * 1024 * 1024, shell: false });
                if (sqlite !== null) {
                    process.once("exit", exitHandler.bind(null));
                    process.once("SIGINT", exitHandler.bind(null));
                    process.once("SIGUSR1", exitHandler.bind(null));
                    process.once("SIGUSR2", exitHandler.bind(null));
                    process.once("uncaughtException", exitHandler.bind(null));
                }
            }
            return [2, sendCommand(["newConnection", path, isuri, autocommit])];
        });
    });
};
exports.setdbPath = setdbPath;
var executeQuery = function (query_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, values) {
        if (values === void 0) { values = []; }
        return __generator(this, function (_a) {
            serializeValues(values);
            return [2, sendCommand(["executeQuery", query, values])];
        });
    });
};
exports.executeQuery = executeQuery;
var fetchAll = function (query_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, values) {
        if (values === void 0) { values = []; }
        return __generator(this, function (_a) {
            serializeValues(values);
            return [2, sendCommand(["fetchall", query, values])];
        });
    });
};
exports.fetchAll = fetchAll;
var fetchOne = function (query_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, values) {
        if (values === void 0) { values = []; }
        return __generator(this, function (_a) {
            serializeValues(values);
            return [2, sendCommand(["fetchone", query, values])];
        });
    });
};
exports.fetchOne = fetchOne;
var fetchMany = function (query_1, size_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([query_1, size_1], args_1, true), void 0, function (query, size, values) {
        if (values === void 0) { values = []; }
        return __generator(this, function (_a) {
            serializeValues(values);
            return [2, sendCommand(["fetchmany", query, size, values])];
        });
    });
};
exports.fetchMany = fetchMany;
var executeMany = function (query, values) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        serializeValues(values);
        return [2, sendCommand(["executeMany", query, values])];
    });
}); };
exports.executeMany = executeMany;
var executeScript = function (scriptname) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, sendCommand(["executeScript", scriptname])];
    });
}); };
exports.executeScript = executeScript;
var load_extension = function (path_2) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([path_2], args_1, true), void 0, function (path, entrypoint) {
        if (entrypoint === void 0) { entrypoint = null; }
        return __generator(this, function (_a) {
            return [2, sendCommand(["load_extension", path, entrypoint])];
        });
    });
};
exports.load_extension = load_extension;
var backup = function (target_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([target_1], args_1, true), void 0, function (target, pages, name, sleep) {
        if (pages === void 0) { pages = -1; }
        if (name === void 0) { name = "main"; }
        if (sleep === void 0) { sleep = 0.250; }
        return __generator(this, function (_a) {
            return [2, sendCommand(["backup", target, pages, name, sleep])];
        });
    });
};
exports.backup = backup;
var iterdump = function (file_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([file_1], args_1, true), void 0, function (file, filter) {
        if (filter === void 0) { filter = null; }
        return __generator(this, function (_a) {
            return [2, sendCommand(["iterdump", file, filter])];
        });
    });
};
exports.iterdump = iterdump;
