const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  paymentType: {
    type: DataTypes.ENUM("free", "per_session", "full_course"),
    allowNull: false,
    defaultValue: "free",
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  registrationStartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  registrationEndDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  minAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maxAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  numberOfSessions: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  scheduleDays: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  autoGenerateSchedule: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
  sessionDates: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "courses",
});

module.exports = Course;