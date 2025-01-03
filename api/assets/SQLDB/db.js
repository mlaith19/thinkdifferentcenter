const Sequelize = require("sequelize");
require("dotenv").config();

const DB_NAME = process.env.SQLDB_NAME || "institution_system";
const DB_USER = process.env.SQLDB_USER || "root";
const DB_PASSWORD = process.env.SQLDB_PASSWORD || "011267";
const DB_HOST = process.env.SQLDB_HOST || "localhost";
const DB_DIALECT = process.env.DB_DIALECT || "mysql";

// تعريف sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  pool: {
    max: 5,
    min: 1,
    acquire: 60000,
    idle: 5000,
  },
  logging: false,
});

// تصدير sequelize instance
module.exports = { sequelize };