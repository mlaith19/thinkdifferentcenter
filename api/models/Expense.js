const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  instituteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Institutes",
      key: "id",
    },
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Branches",
      key: "id",
    },
  },
  vendor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'check', 'bank_transfer', 'visa', 'bit'),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('rent', 'utilities', 'salaries', 'supplies', 'maintenance', 'other'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recordedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid'),
    defaultValue: 'pending',
    allowNull: false,
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Users",
      key: "id",
    },
  },
  approvalDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Expenses",
});

module.exports = Expense;