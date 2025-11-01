import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sequelize from '../utils/sequelize.js';

// Load environment variables before any DB operations
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};

// Dynamically import model files
const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  );
});

for (const file of modelFiles) {
  // Use file:// protocol for Windows compatibility with ES modules
  const fileUrl = new URL(file, import.meta.url).href;
  const { default: modelFunc } = await import(fileUrl);
  const model = modelFunc(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
