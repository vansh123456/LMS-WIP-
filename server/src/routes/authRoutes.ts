import express from "express";
import { register,registerTeacher, login, googleAuth, getProfile,upgradeToTeacher } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register/teacher",registerTeacher);
router.post("/google", googleAuth);
router.get("/profile", authenticateToken, getProfile);
router.post("/upgrade-to-teacher", authenticateToken, upgradeToTeacher);

export default router;