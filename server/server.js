import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "./models/index.js";
import authRoute from "./routers/authRoute.js";
import carRoute from "./routers/carRoute.js";
import customerRoute from "./routers/customerRoute.js";
import rentalRoutes from "./routers/rentalRoutes.js";
import cors from 'cors';
import { createApiUser } from "./utils/momo.js";
import { generateApiKey } from "./utils/momo.js";
import { testConnection } from "./config/database.js";
import { getAccessToken } from "./utils/momo.js";

const app = express();

// Enable CORS with specific options
const corsOptions = {
  origin: ['http://localhost:5000', 'https://in-time-whip.onrender.com'], // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Increase payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the public directory
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
console.log('Serving static files from:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));


app.get("/", (req, res) => {
    res.send("Car Rental API - Welcome!");
});

app.get("/createApiUser", (req, res) => {
    const userId = createApiUser();
    res.json({
        message: "Api User created successfully",
    })
    console.log(userId)
});

app.get("/generateApiKey", (req, res) => {
  const apiKey = generateApiKey();
  res.json({
      message: "Api Key generated successfully",
  })
  console.log(apiKey)
});

app.get("/getAccessToken", (req, res) => {
  const accessToken = getAccessToken();
  res.json({
      message: "Access token retrieved successfully",
      accessToken,
  })
  console.log(accessToken)
})

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/cars", carRoute);
app.use("/api/customers", customerRoute);
app.use("/api/rentals", rentalRoutes);

// Set default port to 3001 if not specified in environment
const PORT = process.env.PORT || 3001;

// Force the port to 3001 for development
const serverPort = 3001;

// Database connection and server start
const startServer = async () => {
  try {
    // Test the database connection first
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models - in production, use migrations instead of force: true
    await db.sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized.');
    // In development, you might want to use { force: true } to reset the database
    // In production, use { alter: true } or just sync()
    await db.sequelize.sync({ force: false });
    console.log('Database synchronized');
    
    await testConnection();
    // Start the server
    app.listen(serverPort, () => {
      console.log(`Server is running on port ${serverPort}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
