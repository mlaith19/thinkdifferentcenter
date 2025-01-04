const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const FinancialReport = sequelize.define("FinancialReport", {
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
  totalRevenue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalExpenses: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  netProfit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  period: {
    type: DataTypes.ENUM("monthly", "quarterly", "yearly"),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "FinancialReports",
});

module.exports = FinancialReport;