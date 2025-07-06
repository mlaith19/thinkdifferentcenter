const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Discount = sequelize.define("Discount", {
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
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Courses",
      key: "id",
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  percentage: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed', 'scholarship'),
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    defaultValue: 'active',
    allowNull: false,
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Discounts",
});

module.exports = Discount; 