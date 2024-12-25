const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../assets/SQLDB/db'); // Use your Sequelize instance

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
