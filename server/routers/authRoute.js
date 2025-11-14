import express from "express";
import { signupController, getUserData } from "../controllers/signupController.js";
import { loginUser, loginAdmin, getMe } from "../controllers/authController.js";
import { initiateGoogleAuth, handleGoogleCallback } from "../controllers/googleAuthController.js";
import { protect } from "../middlewares/authMiddleware.js";

const authRoute = express.Router();

// Public routes
authRoute.post("/signup", signupController);
authRoute.post("/login", loginUser);
authRoute.post("/admin/login", loginAdmin);
authRoute.get("/google", initiateGoogleAuth);
authRoute.get("/google/callback", handleGoogleCallback);

// Protected routes
authRoute.get("/me", protect, getMe);
authRoute.get("/get-user-data", protect, getUserData);

export default authRoute;
