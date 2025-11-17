require("dotenv").config();

const parsePort = (value, fallback = 5432) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const productionConfig = {
  username: process.env.PDB_USER,
  password: process.env.PDB_PASSWORD,
  database: process.env.PDB_NAME,
  host: process.env.PDB_HOST,
  port: parsePort(process.env.PDB_PORT),
  dialect: "postgres",
  dialectOptions: {
    ssl: false
    
  }
};

if (process.env.DATABASE_URL) {
  productionConfig.use_env_variable = "DATABASE_URL";
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || "127.0.0.1",
    port: parsePort(process.env.DB_PORT),
    dialect: "postgres",
    logging: console.log
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME || "test_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parsePort(process.env.DB_PORT),
    dialect: "postgres"
  },
  production: productionConfig
};
