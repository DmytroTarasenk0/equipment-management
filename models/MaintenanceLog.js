const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MaintenanceLog = sequelize.define(
  "MaintenanceLog",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "maintenance_logs",
    timestamps: false,
  },
);

module.exports = MaintenanceLog;
