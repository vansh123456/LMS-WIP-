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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeToTeacher = exports.getProfile = exports.googleAuth = exports.login = exports.registerTeacher = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const auth_1 = require("../utils/auth");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = yield userModel_1.default.scan("email").eq(email).exec();
        if (existingUser.count > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        // Create user with default role "user"
        const user = yield userModel_1.default.create({
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email,
            password: hashedPassword,
            name,
            role: "user",
            provider: "email",
            isEmailVerified: false,
        });
        // Generate token
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.register = register;
const registerTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = yield userModel_1.default.scan("email").eq(email).exec();
        if (existingUser.count > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        // Create teacher
        const user = yield userModel_1.default.create({
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email,
            password: hashedPassword,
            name,
            role: "teacher",
            provider: "email",
            isEmailVerified: false,
        });
        // Generate token
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        res.status(201).json({
            message: "Teacher registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Teacher registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.registerTeacher = registerTeacher;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const users = yield userModel_1.default.scan("email").eq(email).exec();
        if (users.count === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const user = users[0];
        // Verify password
        const isValidPassword = yield (0, auth_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        // Verify Google token
        const googleUser = yield (0, auth_1.verifyGoogleToken)(idToken);
        // Check if user exists
        let users = yield userModel_1.default.scan("googleId").eq(googleUser.googleId).exec();
        if (users.count === 0) {
            // Check by email
            users = yield userModel_1.default.scan("email").eq(googleUser.email).exec();
            if (users.count === 0) {
                // Create new user with default role "user"
                const user = yield userModel_1.default.create({
                    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    email: googleUser.email,
                    name: googleUser.name,
                    avatar: googleUser.picture,
                    role: "user",
                    provider: "google",
                    googleId: googleUser.googleId,
                    isEmailVerified: true,
                });
                const token = (0, auth_1.generateToken)({
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                });
                return res.status(201).json({
                    message: "User created successfully",
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar: user.avatar,
                        role: user.role,
                    },
                });
            }
            else {
                // Update existing user with Google ID
                const user = users[0];
                yield userModel_1.default.update({
                    id: user.id,
                    googleId: googleUser.googleId,
                    avatar: googleUser.picture,
                    provider: "google",
                    isEmailVerified: true,
                });
            }
        }
        const user = users[0];
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.googleAuth = googleAuth;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const user = yield userModel_1.default.get(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProfile = getProfile;
const upgradeToTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const user = yield userModel_1.default.get(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "teacher") {
            return res.status(400).json({ message: "User is already a teacher" });
        }
        // Update user role to teacher
        yield userModel_1.default.update({
            id: userId,
            role: "teacher",
        });
        // Generate new token with updated role
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: "teacher",
        });
        res.json({
            message: "Successfully upgraded to teacher",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: "teacher",
            },
        });
    }
    catch (error) {
        console.error("Upgrade to teacher error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.upgradeToTeacher = upgradeToTeacher;
