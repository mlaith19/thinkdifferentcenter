const Role = require("../models/role");
const Permission = require("../models/Permission");
const { handleError } = require("../utils/errorHandler");

// إنشاء دور جديد
const createRole = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newRole = await Role.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Role created successfully.",
      role: newRole,
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

// تعيين صلاحية لدور معين
const assignPermissionToRole = async (req, res) => {
  const { roleId, permissionId } = req.body;

  try {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (!role || !permission) {
      return res.status(404).json({ message: "Role or permission not found." });
    }

    await role.addPermission(permission);

    res.status(200).json({
      message: "Permission assigned to role successfully.",
    });
  } catch (error) {
    const { statusCode, errorMessage, errorDetails } = handleError(error);
    res.status(statusCode).json({ message: errorMessage, errorDetails });
  }
};

module.exports = {
  createRole,
  assignPermissionToRole,
};