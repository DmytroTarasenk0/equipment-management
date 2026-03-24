const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Equipment = sequelize.define(
  "Equipment",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
    next_maintenance: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "equipment",
    timestamps: false,
  },
);

module.exports = Equipment;
