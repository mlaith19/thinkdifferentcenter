const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Sessions",
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("present", "absent", "late"),
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Attendance",
});

module.exports = Attendance;