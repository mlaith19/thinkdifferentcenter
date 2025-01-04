const User = require("./User");
const Role = require("./role");
const Institute = require("./Institute");
const Branch = require("./Branch");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");

// تعريف العلاقات
User.belongsToMany(Role, { through: "UserRoles", foreignKey: "userId" });
Role.belongsToMany(User, { through: "UserRoles", foreignKey: "roleId" });

User.belongsTo(Institute, { foreignKey: "instituteId" });
Institute.hasMany(User, { foreignKey: "instituteId" });

User.belongsTo(Branch, { foreignKey: "branchId" });
Branch.hasMany(User, { foreignKey: "branchId" });

// تعريف العلاقة بين Role و Permission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

module.exports = { User, Role, Institute, Branch, Permission, RolePermission };