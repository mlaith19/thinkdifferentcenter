const { sequelize } = require("../assets/SQLDB/db");
const { DataTypes } = require("sequelize");

const Permission = sequelize.define("Permission", {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['create', 'update', 'delete', 'view']],
    },
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Export the Permission model
module.exports = Permission;
