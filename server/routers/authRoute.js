import express from "express";
import { signupController, getUserData } from "../controllers/signupController.js";
import { loginUser, loginAdmin, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const authRoute = express.Router();

// Public routes
authRoute.post("/signup", signupController);
authRoute.post("/login", loginUser);
authRoute.post("/admin/login", loginAdmin);

// Protected routes
authRoute.get("/me", protect, getMe);
authRoute.get("/get-user-data", protect, getUserData);

export default authRoute;
