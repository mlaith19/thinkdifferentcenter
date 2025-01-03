const { sequelize } = require("../assets/SQLDB/db");
const { DataTypes } = require("sequelize");
const Branch = require("./Branch");

const Institute = sequelize.define("Institute", {
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
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Institutes",
});

Institute.hasMany(Branch, { foreignKey: "instituteId" });
Branch.belongsTo(Institute, { foreignKey: "instituteId" });

module.exports = Institute;