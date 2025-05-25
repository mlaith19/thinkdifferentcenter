const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");
const Course = require("./Course");

const CourseMaterial = sequelize.define("CourseMaterial", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: "id",
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Define associations
CourseMaterial.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(CourseMaterial, { foreignKey: "courseId" });

module.exports = CourseMaterial; 