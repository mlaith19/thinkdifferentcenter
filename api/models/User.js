const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db"); // Ensure the correct path to your Sequelize instance

const User = sequelize.define(
  "User",
  {
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user", // Default role can be 'user' or anything else
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
      teachingHourType: {
    type: DataTypes.ENUM('45min', '60min'),
    allowNull: true
  },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // New column with default value
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "Users",
  }
);

module.exports = User;
