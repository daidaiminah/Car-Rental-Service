import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['PDB_NAME', 'PDB_USER', 'PDB_PASSWORD', 'PDB_HOST', 'PDB_PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required database environment variables: ${missingVars.join(', ')}`);
}

// Database connection configuration
const dbConfig = {
  database: process.env.PDB_NAME,
  username: process.env.PDB_USER,
  password: process.env.PDB_PASSWORD,
  host: process.env.PDB_HOST,
  port: parseInt(process.env.PDB_PORT, 10) || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'production' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' 
      ? { require: true, rejectUnauthorized: false } 
      : false,
  },
};

// Initialize Sequelize with the configuration
const sequelize = new Sequelize(dbConfig);

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

export { sequelize, testConnection };

