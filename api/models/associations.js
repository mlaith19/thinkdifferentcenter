const User = require("./User");
const Role = require("./role");
const Institute = require("./Institute");
const Branch = require("./Branch");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");
const Payment = require("./Payment");
const Expense = require("./Expense");
const Course = require("./Course");
const ParticipatingStudents = require("./ParticipatingStudents");

// تعريف العلاقات
User.belongsToMany(Role, { through: "UserRoles", foreignKey: "userId" });
Role.belongsToMany(User, { through: "UserRoles", foreignKey: "roleId" });

User.belongsTo(Institute, { foreignKey: "instituteId" });
Institute.hasMany(User, { foreignKey: "instituteId" });

User.belongsTo(Branch, { foreignKey: "branchId", as: "branch" }); // Alias: branch
Branch.hasMany(User, { foreignKey: "branchId", as: "users" });     // Alias: users
Branch.hasMany(Course, { foreignKey: "branchId", as: "courses" }); // Alias: courses
Course.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
// تعريف العلاقة بين Role و Permission
Course.belongsTo(User, { foreignKey: "teacherId", as: "teacher" }); // Alias: teacher
User.hasMany(Course, { foreignKey: "teacherId", as: "courses" });   // Alias: courses
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });
Payment.belongsTo(User, { as: 'RecordedBy', foreignKey: 'recordedBy' });
Expense.belongsTo(User, { as: 'RecordedBy', foreignKey: 'recordedBy' });
Course.belongsToMany(User, {
    through: ParticipatingStudents,
    foreignKey: "courseId",
    as: "students" // Alias for students in a course
});

User.belongsToMany(Course, {
    through: ParticipatingStudents,
    foreignKey: "studentId",
    as: "enrolledCourses" // Alias for courses a student is enrolled in
});
Course.hasMany(ParticipatingStudents, { foreignKey: "courseId", as: "enrollments" });

ParticipatingStudents.belongsTo(Course, { foreignKey: "courseId" });
ParticipatingStudents.belongsTo(User, { foreignKey: "studentId", as: "student" });
module.exports = { User, Role, Institute, Branch, Permission, RolePermission,Course, ParticipatingStudents };