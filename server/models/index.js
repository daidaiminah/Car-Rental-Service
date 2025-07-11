
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; // ✅ Correct named import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};

// Dynamically import and initialize all models
const files = fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.includes('.test.js')
  );

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const module = await import(pathToFileURL(filePath).href);
  const defineModel = module.default;

  if (typeof defineModel === 'function') {
    const model = defineModel(sequelize, DataTypes);

    if (!model || !model.name) {
      throw new Error(`Model in ${file} is missing a name or was not returned properly`);
    }

    db[model.name] = model;
    console.log(`Loaded model: ${model.name}`);
  } else {
    console.warn(`Skipping file ${file}: does not export a default function`);
  }
}

// Set up model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
