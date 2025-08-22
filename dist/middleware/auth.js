"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.requireTeacher = exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }
    try {
        const user = (0, auth_1.verifyToken)(token);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticateToken = authenticateToken;
const requireTeacher = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "teacher") {
        return res.status(403).json({ message: "Teacher access required" });
    }
    next();
};
exports.requireTeacher = requireTeacher;
const requireUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== "user" && req.user.role !== "teacher") {
        return res.status(403).json({ message: "User access required" });
    }
    next();
};
exports.requireUser = requireUser;
