const { sqlDB, createDatabaseIfNotExists, tempSequelize } = require("./db");
const User = require("../../models/User");

const initDB = async () => {
    try {
        // Create the database if it does not exist
        await createDatabaseIfNotExists(tempSequelize);

        // Authenticate with the correct database
        await sqlDB.authenticate(); // Test the connection to the database
        console.log("Connected to MySQL database.");

        // Sync models with the database
        await sqlDB.sync({ alter: true }); // `alter: true` will modify the table to match the model
        console.log("MySQL Database synchronized.");

        // Add any other initialization code here
    } catch (error) {
        console.error("Unable to connect to MySQL database:", error);
    }
};

module.exports = initDB;
