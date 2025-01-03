const { sequelize } = require('../assets/SQLDB/db'); // استيراد sequelize بشكل صحيح
const { DataTypes } = require('sequelize');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Department;