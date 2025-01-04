// models/Permission.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Permission = sequelize.define("Permission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Permissions",
});

module.exports = Permission;