const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const StudentPerformance = sequelize.define("StudentPerformance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  attendanceRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  averageScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "StudentPerformance",
});

module.exports = StudentPerformance;