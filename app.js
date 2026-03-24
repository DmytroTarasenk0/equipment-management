const sequelize = require("./config/db");
const Equipment = require("./models/Equipment");
const MaintenanceLog = require("./models/MaintenanceLog");

// one-to-Many
Equipment.hasMany(MaintenanceLog, { foreignKey: "equipment_id" });
MaintenanceLog.belongsTo(Equipment, { foreignKey: "equipment_id" });

async function appJs() {
  try {
    await sequelize.authenticate();
    console.log("DB connection established");

    await sequelize.sync();
    console.log("Tables synchronized");
  } catch (error) {
    console.error("Error", error);
  }
}
appJs();

module.exports = { sequelize, Equipment, MaintenanceLog };
