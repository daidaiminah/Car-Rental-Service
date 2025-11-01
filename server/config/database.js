// import { Sequelize } from "sequelize";
// import env from "dotenv";

// env.config();

// const parsePort = (value, fallback = 5432) => {
//   const parsed = Number(value);
//   return Number.isFinite(parsed) ? parsed : fallback;
// };

// const isProduction = process.env.NODE_ENV === "production";

// const connectionUri =
//   process.env.DATABASE_URL ||
//   process.env.RENDER_DATABASE_URL ||
//   process.env.POSTGRES_URL ||
//   process.env.PDB_CONNECTION_URI ||
//   null;

// const baseConfig = {
//   dialect: "postgres",
//   logging: isProduction ? false : console.log,
//   define: {
//     timestamps: true,
//     underscored: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at"
//   },
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };

// if (isProduction) {
//   baseConfig.dialectOptions = {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   };
// }

// const resolveValue = (productionValue, developmentValue) => {
//   return isProduction ? productionValue : developmentValue;
// };

// const sequelize = connectionUri
//   ? new Sequelize(connectionUri, baseConfig)
//   : new Sequelize(
//       resolveValue(process.env.PDB_NAME, process.env.DB_NAME || "postgres"),
//       resolveValue(process.env.PDB_USER, process.env.DB_USER || "postgres"),
//       resolveValue(process.env.PDB_PASSWORD, process.env.DB_PASSWORD || ""),
//       {
//         ...baseConfig,
//         host: resolveValue(process.env.PDB_HOST, process.env.DB_HOST || "127.0.0.1"),
//         port: parsePort(resolveValue(process.env.PDB_PORT, process.env.DB_PORT))
//       }
//     );

// const describeConnection = () => {
//   const { host, port, database, username } = sequelize.options;
//   return {
//     host: host || "via connection string",
//     port: port || "default",
//     database: database || "via connection string",
//     username: username ? "***" : "via connection string",
//     ssl: Boolean(sequelize.options.dialectOptions?.ssl)
//   };
// };

// const testConnection = async () => {
//   console.log("=== DATABASE CONNECTION TEST ===");
//   console.log("Environment:", process.env.NODE_ENV || "development");
//   console.log("Connection method:", connectionUri ? "DATABASE_URL" : "Discrete credentials");
//   console.log("Resolved configuration:", describeConnection());

//   try {
//     await sequelize.authenticate();
//     console.log("[OK] Database connection established successfully.");

//     try {
//       const [results] = await sequelize.query("SELECT version();");
//       console.log("Database version:", results?.[0]?.version || "Unknown");
//     } catch (queryError) {
//       console.warn("[WARN] Could not retrieve database version:", queryError.message);
//     }

//     return true;
//   } catch (error) {
//     console.error("[ERROR] Unable to connect to the database");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);

//     if (error.original) {
//       console.error("Original error:", {
//         code: error.original.code,
//         message: error.original.message
//       });
//     }

//     if (error.name === "SequelizeConnectionRefusedError") {
//       console.error("Connection refused. Ensure the database service is reachable and credentials are correct.");
//     } else if (error.name === "SequelizeAccessDeniedError") {
//       console.error("Authentication failed. Verify username, password, and permissions.");
//     } else if (error.name === "SequelizeDatabaseError") {
//       console.error("Database error encountered. Confirm the database exists and is accessible.");
//     }

//     return false;
//   }
// };

// export { sequelize, testConnection };
