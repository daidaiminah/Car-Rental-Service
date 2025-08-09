import express from "express";
import { 
  createCar, 
  getAllCars, 
  getCarById, 
  updateCar, 
  deleteCar, 
  getFeaturedCars,
  getCarsByOwner 
} from "../controllers/carController.js";
import { uploadSingleImage, handleUploadErrors } from "../middlewares/upload.js";

const router = express.Router();

// Car routes
router.post(
  "/create", 
  uploadSingleImage, 
  handleUploadErrors,
  createCar
);

router.get("/", getAllCars);
router.get("/featured", getFeaturedCars);
router.get("/owner/:ownerId", getCarsByOwner);
router.get("/:id", getCarById);
router.put(
  "/:id",
  uploadSingleImage,
  handleUploadErrors,
  updateCar
);
router.delete("/:id", deleteCar);

export default router;
