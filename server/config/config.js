import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT
  },
  production: {
    username: process.env.PDB_USER,
    password: process.env.PDB_PASSWORD,
    database: process.env.PDB_NAME,
    host: process.env.PDB_HOST,
    dialect: "postgres",
    port: process.env.PDB_PORT
  }
}