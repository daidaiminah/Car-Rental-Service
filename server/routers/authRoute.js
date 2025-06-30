import express from "express";
import {signupController, getUserData} from "../controllers/signupController.js";

const authRoute = express.Router();

authRoute.post("/signup", signupController);

//get user data
authRoute.get("/get-user-data", getUserData)

export default authRoute;
