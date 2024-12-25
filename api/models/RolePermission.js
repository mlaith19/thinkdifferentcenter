const { sequelize } = require("../assets/SQLDB/db");
const { DataTypes } = require("sequelize");
const Role = require("./role");
const Permission = require("./Permission");

const RolePermission = sequelize.define("RolePermission", {}, {
  timestamps: false,
});

// Define many-to-many relationship between Role and Permission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });

// Export the RolePermission model
module.exports = RolePermission;
