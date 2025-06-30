import express from "express";
import { createCar, getAllCars, getCarById, updateCar, deleteCar } from "../controllers/carController.js";

const router = express.Router();

// Car routes
router.post("/", createCar);
router.get("/", getAllCars);
router.get("/:id", getCarById);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

export default router;
