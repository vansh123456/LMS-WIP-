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
exports.verifyGoogleToken = exports.comparePassword = exports.hashPassword = exports.verifyToken = exports.generateToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const JWT_SECRET = process.env.JWT_SECRET;
console.log("jwt secret from utils/auth.ts is:" + JWT_SECRET);
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
console.log("google client id is:" + GOOGLE_CLIENT_ID);
const generateToken = (payload) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "2d" });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        "email" in decoded &&
        "name" in decoded &&
        "role" in decoded) {
        return decoded;
    }
    throw new Error("Invalid token payload");
};
exports.verifyToken = verifyToken;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 12;
    return bcryptjs_1.default.hash(password, saltRounds);
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.compare(password, hashedPassword);
});
exports.comparePassword = comparePassword;
const verifyGoogleToken = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
    try {
        const ticket = yield client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            googleId: payload === null || payload === void 0 ? void 0 : payload.sub,
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            name: payload === null || payload === void 0 ? void 0 : payload.name,
            picture: payload === null || payload === void 0 ? void 0 : payload.picture,
        };
    }
    catch (error) {
        console.error("Error verifying Google token:", error);
        throw new Error("Invalid Google token");
    }
});
exports.verifyGoogleToken = verifyGoogleToken;
