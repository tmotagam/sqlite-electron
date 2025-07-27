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
var setdbPath = function (path_2) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([path_2], args_1, true), void 0, function (path, isuri, autocommit) {
        var sqlitePath;
        if (isuri === void 0) { isuri = false; }
        if (autocommit === void 0) { autocommit = true; }
        return __generator(this, function (_a) {
            if (sqlite === null) {
                sqlitePath = "";
                if (process.platform === "win32") {
                    sqlitePath = (0, path_1.join)(__dirname, "..", "sqlite-".concat(process.platform, "-").concat(process.arch), "sqlite-".concat(process.platform, "-").concat(process.arch, ".exe"));
                }
                else {
                    sqlitePath = (0, path_1.join)(__dirname, "..", "sqlite-".concat(process.platform, "-").concat(process.arch), "sqlite-".concat(process.platform, "-").concat(process.arch));
                }
                sqlite = (0, child_process_1.execFile)(sqlitePath, { maxBuffer: 10 * 1024 * 1024 });
                if (sqlite !== null) {
                    process.on("exit", exitHandler.bind(null));
                    process.on("SIGINT", exitHandler.bind(null));
                    process.on("SIGUSR1", exitHandler.bind(null));
                    process.on("SIGUSR2", exitHandler.bind(null));
                    process.on("uncaughtException", function () {
                        exitHandler.bind(null);
                    });
                }
            }
            return [2, new Promise(function (resolve, reject) {
                    try {
                        if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                            return reject("Sqlite not defined");
                        }
                        var string_1 = "";
                        var onData_1 = function (data) {
                            string_1 += data.toString();
                            if (string_1.substring(string_1.length - 3) === "EOF") {
                                resolve(JSON.parse(string_1.split("EOF")[0]));
                                sqlite.stdout.off("data", onData_1);
                            }
                        };
                        sqlite.stdout.on("data", onData_1);
                        sqlite.stdin.write("".concat(JSON.stringify(["newConnection", path, isuri, autocommit]), "\n"));
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
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
            return [2, new Promise(function (resolve, reject) {
                    try {
                        if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                            return reject("Sqlite not defined");
                        }
                        var string_2 = "";
                        var onData_2 = function (data) {
                            string_2 += data.toString();
                            if (string_2.substring(string_2.length - 3) === "EOF") {
                                resolve(JSON.parse(string_2.split("EOF")[0]));
                                sqlite.stdout.off("data", onData_2);
                            }
                        };
                        sqlite.stdout.on("data", onData_2);
                        for (var i = 0; i < values.length; i++) {
                            if (!Buffer.isBuffer(values[i])) {
                                continue;
                            }
                            values[i] = JSON.stringify(values[i]);
                        }
                        sqlite.stdin.write("".concat(JSON.stringify(["executeQuery", query, values]), "\n"));
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
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
            return [2, new Promise(function (resolve, reject) {
                    try {
                        if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                            return reject("Sqlite not defined");
                        }
                        var string_3 = "";
                        var onData_3 = function (data) {
                            string_3 += data.toString();
                            if (string_3.substring(string_3.length - 3) === "EOF") {
                                var d = JSON.parse(string_3.split("EOF")[0]);
                                var _loop_1 = function (i) {
                                    var de = d[i];
                                    Object.keys(de).forEach(function (i) {
                                        var element = de[i];
                                        if (typeof element === "object" &&
                                            !Array.isArray(element) &&
                                            element !== null &&
                                            element.type == "Buffer" &&
                                            Array.isArray(element.data)) {
                                            de[i] = Buffer.from(element.data);
                                        }
                                    });
                                };
                                for (var i = 0; i < d.length; i++) {
                                    _loop_1(i);
                                }
                                if (string_3.startsWith('"Error: ')) {
                                    reject(d);
                                }
                                else {
                                    resolve(d);
                                }
                                sqlite.stdout.off("data", onData_3);
                            }
                        };
                        sqlite.stdout.on("data", onData_3);
                        for (var i = 0; i < values.length; i++) {
                            if (!Buffer.isBuffer(values[i])) {
                                continue;
                            }
                            values[i] = JSON.stringify(values[i]);
                        }
                        sqlite.stdin.write("".concat(JSON.stringify(["fetchall", query, values]), "\n"));
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
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
            return [2, new Promise(function (resolve, reject) {
                    try {
                        if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                            return reject("Sqlite not defined");
                        }
                        var string_4 = "";
                        var onData_4 = function (data) {
                            string_4 += data.toString();
                            if (string_4.substring(string_4.length - 3) === "EOF") {
                                var d_1 = JSON.parse(string_4.split("EOF")[0]);
                                Object.keys(d_1).forEach(function (key) {
                                    var element = d_1[key];
                                    if (typeof element === "object" &&
                                        !Array.isArray(element) &&
                                        element !== null &&
                                        element.type == "Buffer" &&
                                        Array.isArray(element.data)) {
                                        d_1[key] = Buffer.from(element.data);
                                    }
                                });
                                if (string_4.startsWith('"Error: ')) {
                                    reject(d_1);
                                }
                                else {
                                    resolve(d_1);
                                }
                                sqlite.stdout.off("data", onData_4);
                            }
                        };
                        sqlite.stdout.on("data", onData_4);
                        for (var i = 0; i < values.length; i++) {
                            if (!Buffer.isBuffer(values[i])) {
                                continue;
                            }
                            values[i] = JSON.stringify(values[i]);
                        }
                        sqlite.stdin.write("".concat(JSON.stringify(["fetchone", query, values]), "\n"));
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
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
            return [2, new Promise(function (resolve, reject) {
                    try {
                        if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                            return reject("Sqlite not defined");
                        }
                        var string_5 = "";
                        var onData_5 = function (data) {
                            string_5 += data.toString();
                            if (string_5.substring(string_5.length - 3) === "EOF") {
                                var d = JSON.parse(string_5.split("EOF")[0]);
                                var _loop_2 = function (i) {
                                    var de = d[i];
                                    Object.keys(de).forEach(function (i) {
                                        var element = de[i];
                                        if (typeof element === "object" &&
                                            !Array.isArray(element) &&
                                            element !== null &&
                                            element.type == "Buffer" &&
                                            Array.isArray(element.data)) {
                                            de[i] = Buffer.from(element.data);
                                        }
                                    });
                                };
                                for (var i = 0; i < d.length; i++) {
                                    _loop_2(i);
                                }
                                if (string_5.startsWith('"Error: ')) {
                                    reject(d);
                                }
                                else {
                                    resolve(d);
                                }
                                sqlite.stdout.off("data", onData_5);
                            }
                        };
                        sqlite.stdout.on("data", onData_5);
                        for (var i = 0; i < values.length; i++) {
                            if (!Buffer.isBuffer(values[i])) {
                                continue;
                            }
                            values[i] = JSON.stringify(values[i]);
                        }
                        sqlite.stdin.write("".concat(JSON.stringify(["fetchmany", query, size, values]), "\n"));
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
        });
    });
};
exports.fetchMany = fetchMany;
var executeMany = function (query, values) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                try {
                    if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                        return reject("Sqlite not defined");
                    }
                    var string_6 = "";
                    var onData_6 = function (data) {
                        string_6 += data.toString();
                        if (string_6.substring(string_6.length - 3) === "EOF") {
                            resolve(JSON.parse(string_6.split("EOF")[0]));
                            sqlite.stdout.off("data", onData_6);
                        }
                    };
                    sqlite.stdout.on("data", onData_6);
                    for (var i = 0; i < values.length; i++) {
                        for (var j = 0; j < values[i].length; j++) {
                            if (!Buffer.isBuffer(values[i][j])) {
                                continue;
                            }
                            values[i][j] = JSON.stringify(values[i][j]);
                        }
                    }
                    sqlite.stdin.write("".concat(JSON.stringify(["executeMany", query, values]), "\n"));
                }
                catch (error) {
                    reject(error);
                }
            })];
    });
}); };
exports.executeMany = executeMany;
var executeScript = function (scriptname) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                try {
                    if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                        return reject("Sqlite not defined");
                    }
                    var string_7 = "";
                    var onData_7 = function (data) {
                        string_7 += data.toString();
                        if (string_7.substring(string_7.length - 3) === "EOF") {
                            resolve(JSON.parse(string_7.split("EOF")[0]));
                            sqlite.stdout.off("data", onData_7);
                        }
                    };
                    sqlite.stdout.on("data", onData_7);
                    sqlite.stdin.write("".concat(JSON.stringify(["executeScript", scriptname]), "\n"));
                }
                catch (error) {
                    reject(error);
                }
            })];
    });
}); };
exports.executeScript = executeScript;
var load_extension = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                try {
                    if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                        return reject("Sqlite not defined");
                    }
                    var string_8 = "";
                    var onData_8 = function (data) {
                        string_8 += data.toString();
                        if (string_8.substring(string_8.length - 3) === "EOF") {
                            resolve(JSON.parse(string_8.split("EOF")[0]));
                            sqlite.stdout.off("data", onData_8);
                        }
                    };
                    sqlite.stdout.on("data", onData_8);
                    sqlite.stdin.write("".concat(JSON.stringify(["load_extension", path]), "\n"));
                }
                catch (error) {
                    reject(error);
                }
            })];
    });
}); };
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
            return [2, new Promise(function (resolve, reject) {
                    try {
                        if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                            return reject("Sqlite not defined");
                        }
                        var string_9 = "";
                        var onData_9 = function (data) {
                            string_9 += data.toString();
                            if (string_9.substring(string_9.length - 3) === "EOF") {
                                resolve(JSON.parse(string_9.split("EOF")[0]));
                                sqlite.stdout.off("data", onData_9);
                            }
                        };
                        sqlite.stdout.on("data", onData_9);
                        sqlite.stdin.write("".concat(JSON.stringify(["backup", target, pages, name, sleep]), "\n"));
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
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
            return [2, new Promise(function (resolve, reject) {
                    try {
                        if (sqlite === null || sqlite.stdin === null || sqlite.stdout === null) {
                            return reject("Sqlite not defined");
                        }
                        var string_10 = "";
                        var onData_10 = function (data) {
                            string_10 += data.toString();
                            if (string_10.substring(string_10.length - 3) === "EOF") {
                                resolve(JSON.parse(string_10.split("EOF")[0]));
                                sqlite.stdout.off("data", onData_10);
                            }
                        };
                        sqlite.stdout.on("data", onData_10);
                        sqlite.stdin.write("".concat(JSON.stringify(["iterdump", file, filter]), "\n"));
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
        });
    });
};
exports.iterdump = iterdump;
