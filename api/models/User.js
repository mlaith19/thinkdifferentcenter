const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

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
      model: "Branches",
      key: "id",
    },
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Users",
});

module.exports = User;