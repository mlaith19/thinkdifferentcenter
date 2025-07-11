const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Payment = sequelize.define(
  "Payment",
  {
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
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "check", "bank_transfer", "visa", "bit"),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    installmentNumber: DataTypes.INTEGER,
    totalInstallments: DataTypes.INTEGER,
    paymentPlanId: {
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
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "Payments",
  }
);

module.exports = Payment;
