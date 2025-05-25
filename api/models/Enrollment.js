const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Enrollment = sequelize.define(
  "Enrollment",
  {
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
    status: {
      type: DataTypes.ENUM("active", "completed", "dropped"),
      defaultValue: "active",
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    attendanceRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "Enrollments",
  }
);

// Define associations
Enrollment.associate = (models) => {
  Enrollment.belongsTo(models.User, {
    foreignKey: "studentId",
    as: "Student",
  });
  Enrollment.belongsTo(models.Course, {
    foreignKey: "courseId",
    as: "Course",
  });
};

module.exports = Enrollment; 