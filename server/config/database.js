import { Sequelize } from 'sequelize';
import env from 'dotenv';

env.config();


// Log environment for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Database Host:', process.env.PDB_HOST || 'Not set');

// Database connection configuration
const dbConfig = {
  database: process.env.PDB_NAME,
  username: process.env.PDB_USER,
  password: process.env.PDB_PASSWORD,
  host: process.env.PDB_HOST,
  port: parseInt(process.env.PDB_PORT, 10) || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
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
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
};

// Initialize Sequelize with the configuration
const sequelize = new Sequelize(dbConfig);

// Test the database connection
const testConnection = async () => {
  console.log('=== DATABASE CONNECTION TEST ===');
  console.log('Environment:', process.env.NODE_ENV);
  
  //Log environment variables for debugging
  console.log('Environment Variables:', {
    PDB_HOST: process.env.PDB_HOST ? '***' : 'Not set',
    PDB_PORT: process.env.PDB_PORT || 'Not set (using default 5432)',
    PDB_NAME: process.env.PDB_NAME ? '***' : 'Not set',
    PDB_USER: process.env.PDB_USER ? '***' : 'Not set',
    PDB_PASSWORD: process.env.PDB_PASSWORD ? '***' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'production'
  });
  
  try {
    console.log('Attempting to connect to database...');
    console.log('Database config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      username: dbConfig.username,
      ssl: dbConfig.dialectOptions.ssl,
      dialect: dbConfig.dialect
    });
    
    await sequelize.authenticate();
    console.log('? Database connection has been established successfully.');
    
    // Test a simple query
    try {
      const [results] = await sequelize.query('SELECT version();');
      console.log('Database version:', results[0]?.version || 'Unknown');
    } catch (queryError) {
      console.warn('??  Could not get database version:', queryError.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ UNABLE TO CONNECT TO THE DATABASE');
    console.error('Error name:', error.name);
    console.error('Error code:', error.parent?.code || 'N/A');
    console.error('Error message:', error.message);
    
    if (error.original) {
      console.error('Original error:', {
        code: error.original.code,
        message: error.original.message,
        stack: error.original.stack
      });
    }
    
    // Log specific connection issues
    if (error.name === 'SequelizeConnectionRefusedError') {
      console.error('🔌 Connection refused. Check if:');
      console.error('1. Database server is running');
      console.error('2. Host and port are correct');
      console.error('3. Firewall allows connections');
    } else if (error.name === 'SequelizeAccessDeniedError') {
      console.error('🔑 Authentication failed. Check if:');
      console.error('1. Username and password are correct');
      console.error('2. User has proper permissions');
    } else if (error.name === 'SequelizeDatabaseError') {
      console.error('💾 Database error. Check if:');
      console.error('1. Database exists');
      console.error('2. Database is accessible');
    }
    
    return false;
  }
};

export { sequelize, testConnection };

