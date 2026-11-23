const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const db = {};

// Auto-load all model files
const modelsDir = path.join(__dirname);
fs.readdirSync(modelsDir)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(modelsDir, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;