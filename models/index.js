const sequelize = require("../config/db");
const Equipment = require("./Equipment");
const MaintenanceLog = require("./MaintenanceLog");
const User = require("./User");

// all One-to-Many/Many-to-Many relationships
Equipment.hasMany(MaintenanceLog, { foreignKey: "equipment_id" });
MaintenanceLog.belongsTo(Equipment, { foreignKey: "equipment_id" });

User.hasMany(MaintenanceLog, { foreignKey: "user_id" });
MaintenanceLog.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  Equipment,
  MaintenanceLog,
  User,
};
