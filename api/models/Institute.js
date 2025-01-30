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

 

// Updated associations
Institute.hasMany(Branch, {
  foreignKey: "instituteId",
  as: "branches",
  onDelete: 'CASCADE',
  hooks: true
});

Branch.belongsTo(Institute, {
  foreignKey: "instituteId",
  as: "institute"
});

Institute.hasOne(User, {
  foreignKey: "instituteId",
  as: "admin",
  scope: {
    role: 'institute_admin'
  }
});

User.belongsTo(Institute, {
  foreignKey: "instituteId",
  as: "adminInstitute"
});

module.exports = Institute;
