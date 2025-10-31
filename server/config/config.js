import env from "dotenv";

// Load environment variables from .env file
env.config();

const parsePort = (value, fallback = 5432) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const productionConfig = {
  username: process.env.PDB_USER,
  password: process.env.PDB_PASSWORD,
  database: process.env.PDB_NAME,
  host: process.env.PDB_HOST,
  dialect: "postgres",
  port: parsePort(process.env.PDB_PORT),
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

if (process.env.DATABASE_URL) {
  productionConfig.use_env_variable = "DATABASE_URL";
}

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: parsePort(process.env.DB_PORT)
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: parsePort(process.env.DB_PORT)
  },
  production: productionConfig
};
