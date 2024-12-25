const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../assets/SQLDB/db'); // Use your Sequelize instance

const Role = sequelize.define('Role', {
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

module.exports = Role;
