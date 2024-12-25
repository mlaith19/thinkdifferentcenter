const Sequelize = require("sequelize");
require("dotenv").config();

const DB_NAME = process.env.SQLDB_NAME || "institution_system";
const DB_USER = process.env.SQLDB_USER || "root";
const DB_PASSWORD = process.env.SQLDB_PASSWORD || "011267";
const DB_HOST = process.env.SQLDB_HOST || "localhost";
const DB_DIALECT = process.env.DB_DIALECT || "mysql";

// Create a Sequelize instance
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

// Function to authenticate and test the connection
const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Export the sequelize instance for use in models
module.exports = { sequelize, testDatabaseConnection };
