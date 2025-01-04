const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Roles",
});

module.exports = Role;