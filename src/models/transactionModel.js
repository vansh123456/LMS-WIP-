"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dynamoose_1 = require("dynamoose");
var transactionSchema = new dynamoose_1.Schema({
    userId: {
        type: String,
        hashKey: true,
        required: true,
    },
    transactionId: {
        type: String,
        rangeKey: true,
        required: true,
    },
    dateTime: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
        index: {
            name: "CourseTransactionsIndex",
            type: "global",
        },
    },
    paymentProvider: {
        type: String,
        enum: ["stripe"],
        required: true,
    },
    amount: Number,
}, {
    saveUnknown: true,
    timestamps: true,
});
var Transaction = (0, dynamoose_1.model)("Transaction", transactionSchema);
exports.default = Transaction;
