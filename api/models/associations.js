const User = require("./User");
const Role = require("./role");
const Institute = require("./Institute");
const Branch = require("./Branch");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");
const Payment = require("./Payment");
const Expense = require("./Expense");
const Course = require("./Course");
// تعريف العلاقات
User.belongsToMany(Role, { through: "UserRoles", foreignKey: "userId" });
Role.belongsToMany(User, { through: "UserRoles", foreignKey: "roleId" });

User.belongsTo(Institute, { foreignKey: "instituteId" });
Institute.hasMany(User, { foreignKey: "instituteId" });

User.belongsTo(Branch, { foreignKey: "branchId", as: "branch" }); // Alias: branch
Branch.hasMany(User, { foreignKey: "branchId", as: "users" });     // Alias: users
Branch.hasMany(Course, { foreignKey: "branchId", as: "courses" }); // Alias: courses
// تعريف العلاقة بين Role و Permission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });
Payment.belongsTo(User, { as: 'RecordedBy', foreignKey: 'recordedBy' });
Expense.belongsTo(User, { as: 'RecordedBy', foreignKey: 'recordedBy' });
module.exports = { User, Role, Institute, Branch, Permission, RolePermission };