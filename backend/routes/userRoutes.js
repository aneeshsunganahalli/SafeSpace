import express from "express";
import { loginUser, registerUser, getUserProfile } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", verifyToken, getUserProfile);

export default router;