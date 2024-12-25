 const { sequelize } = require("../assets/SQLDB/db");  // Correctly import sequelize

const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100], // Password must be between 8 and 100 characters
    },
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100], // Full name should be descriptive
    },
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true, // Ensure the profile picture is a valid URL
    },
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Roles",
      key: "id",
    },
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Departments",
      key: "id",
    },
  },
  isPrime: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true, // User-specific preferences
    defaultValue: {
      notifications: true,
      theme: "light",
    },
  },
  notifications: {
    type: DataTypes.JSON,
    allowNull: true, // A list of user notifications
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "pending", "suspended"),
    allowNull: false,
    defaultValue: "active",
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
  paranoid: true, // Adds deletedAt for soft deletes
  tableName: "Users", // Explicit table name
  indexes: [
    {
      unique: true,
      fields: ["email"],
    },
    {
      fields: ["username"],
    },
  ],
});

module.exports = User;
