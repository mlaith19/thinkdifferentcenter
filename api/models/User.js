const { sequelize } = require("../assets/SQLDB/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Please provide a valid email address.",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM("super_admin", "institute_admin", "secretary", "teacher", "student", "accountant"),
    allowNull: false,
    defaultValue: "student",
  },
  instituteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Institutes",
      key: "id",
    },
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Branches", // reference to Branch model
      key: "id",
    },
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Users",
});

module.exports = User;
