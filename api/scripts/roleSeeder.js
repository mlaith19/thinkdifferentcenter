const { sequelize } = require("../assets/SQLDB/db");
const Role = require("../models/role");
const Permission = require("../models/Permission");

const seedRolesAndPermissions = async () => {
  try {
    // التحقق من وجود أدوار بالفعل
    const existingRoles = await Role.findAll();
    if (existingRoles.length > 0) {
      console.log("Roles already seeded.");
      return;
    }

    // تعريف الأدوار الأساسية
    const roles = [
      { name: "super_admin", description: "Super Admin with full access" },
      { name: "institute_admin", description: "Admin of a specific institute" },
      { name: "secretary", description: "Secretary role for managing students and teachers" },
      { name: "teacher", description: "Teacher role for managing classes" },
      { name: "student", description: "Student role for attending classes" },
      { name: "accountant", description: "Accountant role for managing finances" },
    ];

    // تعريف الصلاحيات الأساسية
    const permissions = [
      { action: "create", resource: "user" },
      { action: "read", resource: "user" },
      { action: "update", resource: "user" },
      { action: "delete", resource: "user" },
      { action: "create", resource: "course" },
      { action: "read", resource: "course" },
      { action: "update", resource: "course" },
      { action: "delete", resource: "course" },
      { action: "create", resource: "payment" },
      { action: "read", resource: "payment" },
      { action: "update", resource: "payment" },
      { action: "delete", resource: "payment" },
    ];

    // إنشاء الأدوار
    const seededRoles = await Role.bulkCreate(roles);
    console.log("Roles seeded successfully.");

    // إنشاء الصلاحيات
    const seededPermissions = await Permission.bulkCreate(permissions);
    console.log("Permissions seeded successfully.");

    // تعيين الصلاحيات للأدوار
    const superAdminRole = seededRoles.find(role => role.name === "super_admin");
    const instituteAdminRole = seededRoles.find(role => role.name === "institute_admin");

    if (superAdminRole) {
      await superAdminRole.addPermissions(seededPermissions); // Super Admin لديه جميع الصلاحيات
    }

    if (instituteAdminRole) {
      const instituteAdminPermissions = seededPermissions.filter(
        permission => permission.resource === "user" || permission.resource === "course"
      );
      await instituteAdminRole.addPermissions(instituteAdminPermissions);
    }

    console.log("Role permissions linked successfully.");
  } catch (error) {
    console.error("Error seeding roles and permissions:", error);
  }
};

module.exports = seedRolesAndPermissions;