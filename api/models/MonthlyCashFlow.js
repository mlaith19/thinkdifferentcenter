const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const MonthlyCashFlow = sequelize.define("MonthlyCashFlow", {
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
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cashIn: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  checkIn: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bankTransferIn: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  visaIn: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bitIn: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  cashOut: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  checkOut: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bankTransferOut: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  visaOut: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bitOut: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalIn: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalOut: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  netFlow: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  recordedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "MonthlyCashFlows",
});

module.exports = MonthlyCashFlow; 