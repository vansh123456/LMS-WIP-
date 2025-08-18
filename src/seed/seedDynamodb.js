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
exports.default = seed;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var fs_1 = require("fs");
var path_1 = require("path");
var dynamoose_1 = require("dynamoose");
var pluralize_1 = require("pluralize");
var transactionModel_1 = require("../models/transactionModel");
var courseModel_1 = require("../models/courseModel");
var userCourseProgressModel_1 = require("../models/userCourseProgressModel");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var client;
/* DynamoDB Configuration */
var isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
    dynamoose_1.default.aws.ddb.local();
    client = new client_dynamodb_1.DynamoDBClient({
        endpoint: "http://localhost:8000",
        region: "us-east-2",
        credentials: {
            accessKeyId: "dummyKey123",
            secretAccessKey: "dummyKey123",
        },
    });
}
else {
    client = new client_dynamodb_1.DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-2",
    });
}
/* DynamoDB Suppress Tag Warnings */
var originalWarn = console.warn.bind(console);
console.warn = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!message.includes("Tagging is not currently supported in DynamoDB Local")) {
        originalWarn.apply(void 0, __spreadArray([message], args, false));
    }
};
function createTables() {
    return __awaiter(this, void 0, void 0, function () {
        var models, _i, models_1, model, tableName, table, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    models = [transactionModel_1.default, userCourseProgressModel_1.default, courseModel_1.default];
                    _i = 0, models_1 = models;
                    _a.label = 1;
                case 1:
                    if (!(_i < models_1.length)) return [3 /*break*/, 7];
                    model = models_1[_i];
                    tableName = model.name;
                    table = new dynamoose_1.default.Table(tableName, [model], {
                        create: true,
                        update: true,
                        waitForActive: true,
                        throughput: { read: 5, write: 5 },
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, table.initialize()];
                case 4:
                    _a.sent();
                    console.log("Table created and initialized: ".concat(tableName));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error creating table ".concat(tableName, ":"), error_1.message, error_1.stack);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function seedData(tableName, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var data, formattedTableName, _i, data_1, item, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
                    formattedTableName = pluralize_1.default.singular(tableName.charAt(0).toUpperCase() + tableName.slice(1));
                    console.log("Seeding data to table: ".concat(formattedTableName));
                    _i = 0, data_1 = data;
                    _a.label = 1;
                case 1:
                    if (!(_i < data_1.length)) return [3 /*break*/, 6];
                    item = data_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, dynamoose_1.default.model(formattedTableName).create(item)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error("Unable to add item to ".concat(formattedTableName, ". Error:"), JSON.stringify(err_1, null, 2));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("\x1b[32m%s\x1b[0m", "Successfully seeded data to table: ".concat(formattedTableName));
                    return [2 /*return*/];
            }
        });
    });
}
function deleteTable(baseTableName) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteCommand, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deleteCommand = new client_dynamodb_1.DeleteTableCommand({ TableName: baseTableName });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.send(deleteCommand)];
                case 2:
                    _a.sent();
                    console.log("Table deleted: ".concat(baseTableName));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    if (err_2.name === "ResourceNotFoundException") {
                        console.log("Table does not exist: ".concat(baseTableName));
                    }
                    else {
                        console.error("Error deleting table ".concat(baseTableName, ":"), err_2);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteAllTables() {
    return __awaiter(this, void 0, void 0, function () {
        var listTablesCommand, TableNames, _i, TableNames_1, tableName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listTablesCommand = new client_dynamodb_1.ListTablesCommand({});
                    return [4 /*yield*/, client.send(listTablesCommand)];
                case 1:
                    TableNames = (_a.sent()).TableNames;
                    if (!(TableNames && TableNames.length > 0)) return [3 /*break*/, 6];
                    _i = 0, TableNames_1 = TableNames;
                    _a.label = 2;
                case 2:
                    if (!(_i < TableNames_1.length)) return [3 /*break*/, 6];
                    tableName = TableNames_1[_i];
                    return [4 /*yield*/, deleteTable(tableName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var seedDataPath, files, _i, files_1, file, tableName, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deleteAllTables()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createTables()];
                case 3:
                    _a.sent();
                    seedDataPath = path_1.default.join(__dirname, "./data");
                    files = fs_1.default
                        .readdirSync(seedDataPath)
                        .filter(function (file) { return file.endsWith(".json"); });
                    _i = 0, files_1 = files;
                    _a.label = 4;
                case 4:
                    if (!(_i < files_1.length)) return [3 /*break*/, 7];
                    file = files_1[_i];
                    tableName = path_1.default.basename(file, ".json");
                    filePath = path_1.default.join(seedDataPath, file);
                    return [4 /*yield*/, seedData(tableName, filePath)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    seed().catch(function (error) {
        console.error("Failed to run seed script:", error);
    });
}
