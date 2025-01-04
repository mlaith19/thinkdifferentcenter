const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const TeacherPerformance = sequelize.define("TeacherPerformance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  totalTeachingHours: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  averageRating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "TeacherPerformance",
});

module.exports = TeacherPerformance;