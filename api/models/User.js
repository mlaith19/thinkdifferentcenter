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
      type: DataTypes.ENUM("45min", "60min"),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // New column with default value
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },   phone: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   is: /^[0-9]{10,15}$/, // Adjust the regex pattern based on your requirements
      //   msg: "Please provide a valid phone number.",
      // },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "Users",
  }
);

module.exports = User;
