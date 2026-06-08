import sequelize from "../config/db";
import User from "./User";
import Equipment from "./Equipment";
import MaintenanceLog from "./MaintenanceLog";

Equipment.hasMany(MaintenanceLog, { foreignKey: "equipment_id", as: "logs" });
MaintenanceLog.belongsTo(Equipment, {
  foreignKey: "equipment_id",
  as: "equipment",
});

User.hasMany(MaintenanceLog, { foreignKey: "user_id", as: "logs" });
MaintenanceLog.belongsTo(User, { foreignKey: "user_id", as: "user" });

export { sequelize, User, Equipment, MaintenanceLog };
