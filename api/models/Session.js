const { DataTypes } = require("sequelize");
const { sequelize } = require("../assets/SQLDB/db");

const Session = sequelize.define("Session", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Courses",
      key: "id",
    },
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // نفترض أن المدرس هو نوع من أنواع المستخدمين (User)
      key: "id",
    },
  },
}, {
  timestamps: true,
  paranoid: true,
  tableName: "Sessions",
});

module.exports = Session;