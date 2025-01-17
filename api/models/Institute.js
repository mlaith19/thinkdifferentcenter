const { sequelize } = require("../assets/SQLDB/db");
const { DataTypes } = require("sequelize");
const Branch = require("./Branch");
const User = require("./User");

const Institute = sequelize.define(
  "Institute",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    licenseKey: {
      type: DataTypes.TEXT, // Encrypted license key
      allowNull: false, 
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "Institutes",
  }
);

 


Institute.hasMany(Branch, { foreignKey: "instituteId", as: "branches" }); // Alias: branches
Branch.belongsTo(Institute, { foreignKey: "instituteId", as: "branches" }); // Alias: branches
Institute.hasOne(User, { foreignKey: "instituteId", as: "admin" }); // Alias: admin
User.belongsTo(Institute, { foreignKey: "instituteId", as: "admin" }); // Alias: admin

module.exports = Institute;
