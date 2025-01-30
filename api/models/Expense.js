const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");
const Expense = sequelize.define("Expense", {
    vendor: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    paymentMethod: DataTypes.ENUM('cash', 'check', 'bank_transfer', 'visa', 'bit'),
    paymentDate: DataTypes.DATE,
    recordedBy: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' }
    }
  });
  
  module.exports = Expense;