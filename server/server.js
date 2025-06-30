import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "./models/index.js";
import authRoute from "./routers/authRoute.js";
import carRoute from "./routers/carRoute.js";
import customerRoute from "./routers/customerRoute.js";
import rentalRoute from "./routers/rentalRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Car Rental API - Welcome!");
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/cars", carRoute);
app.use("/api/customers", customerRoute);
app.use("/api/rentals", rentalRoute);

app.listen(3000, () => {
    db.sequelize.sync({
        force: true
    }).then(() => {
        console.log("Database connected and it is running Now");
    })
    .catch((err) => {
        console.log(err);
    })
    console.log("Server is running on port 3000");
});
