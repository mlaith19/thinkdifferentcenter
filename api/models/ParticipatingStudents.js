const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const ParticipatingStudents = sequelize.define(
  "ParticipatingStudents",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Courses", // Reference the Courses table
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Reference the Users table
        key: "id",
      },
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set to the current date
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "completed", "dropped"),
      allowNull: false,
      defaultValue: "active", // Default status is active
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "participating_students",
  }
);

module.exports = ParticipatingStudents;
