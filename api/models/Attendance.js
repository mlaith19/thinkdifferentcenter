const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Attendance = sequelize.define(
  "Attendance",
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
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Sessions",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "late", "excused"),
      allowNull: false,
      defaultValue: "absent",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    markedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    markedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "attendance",
  }
);

// Define associations
Attendance.associate = (models) => {
  Attendance.belongsTo(models.User, {
    foreignKey: "studentId",
    as: "student",
  });
  Attendance.belongsTo(models.Session, {
    foreignKey: "sessionId",
    as: "session",
  });
  Attendance.belongsTo(models.User, {
    foreignKey: "markedBy",
    as: "marker",
  });
};

module.exports = Attendance;
