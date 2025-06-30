import express from "express";
import { createRental, getAllRentals, getRentalById, deleteRental } from "../controllers/rentalController.js";

const router = express.Router();

// Rental routes
router.post("/", createRental);
router.get("/", getAllRentals);
router.get("/:id", getRentalById);
router.delete("/:id", deleteRental);

export default router;
