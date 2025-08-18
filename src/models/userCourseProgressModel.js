"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dynamoose_1 = require("dynamoose");
var chapterProgressSchema = new dynamoose_1.Schema({
    chapterId: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
});
var sectionProgressSchema = new dynamoose_1.Schema({
    sectionId: {
        type: String,
        required: true,
    },
    chapters: {
        type: Array,
        schema: [chapterProgressSchema],
    },
});
var userCourseProgressSchema = new dynamoose_1.Schema({
    userId: {
        type: String,
        hashKey: true,
        required: true,
    },
    courseId: {
        type: String,
        rangeKey: true,
        required: true,
    },
    enrollmentDate: {
        type: String,
        required: true,
    },
    overallProgress: {
        type: Number,
        required: true,
    },
    sections: {
        type: Array,
        schema: [sectionProgressSchema],
    },
    lastAccessedTimestamp: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
var UserCourseProgress = (0, dynamoose_1.model)("UserCourseProgress", userCourseProgressSchema);
exports.default = UserCourseProgress;
