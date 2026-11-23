const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Connected successfully.');
  } catch (error) {
    console.error('Unable to connect to SQLite:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };