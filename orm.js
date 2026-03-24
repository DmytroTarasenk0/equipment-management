const sequelize = require("./config/db");
const Equipment = require("./models/Equipment");
const MaintenanceLog = require("./models/MaintenanceLog");

// setup One-to-Many relationship between models
Equipment.hasMany(MaintenanceLog, { foreignKey: "equipment_id" });
MaintenanceLog.belongsTo(Equipment, { foreignKey: "equipment_id" });

async function runORMQueries() {
  try {
    await sequelize.authenticate();
    console.log("DB Connection established");

    // sync models
    await sequelize.sync();
    console.log("Models synchronized");

    // add new equipment
    console.log("\nORM CREATE");
    const newEquipment = await Equipment.create({
      name: "Ultrasound Machine V2",
      serial_number: "US-2026-" + Math.floor(Math.random() * 1000), // random serial
      status: "Active",
      next_maintenance: "2026-12-01",
    });
    console.log(`Created Equipment with ID: ${newEquipment.id}`);

    // create a related maintenance log for this specific equipment
    await MaintenanceLog.create({
      equipment_id: newEquipment.id,
      user_id: 1,
      date: "2026-03-24",
      description: "Initial setup and calibration performed.",
    });
    console.log("Created associated Maintenance Log");

    // get equipment with its maintenance logs
    console.log("\nORM READ");
    const equipmentWithLogs = await Equipment.findOne({
      where: { id: newEquipment.id },
      include: MaintenanceLog,
    });

    console.log(JSON.stringify(equipmentWithLogs, null, 2));

    // change the status of the equipment
    console.log("\nORM UPDATE");
    await Equipment.update(
      { status: "Maintenance" },
      { where: { id: newEquipment.id } },
    );
    console.log("Equipment status updated to 'Maintenance'");

    // // delete the equipment
    // console.log("\nORM DELETE");
    // await Equipment.destroy({ where: { id: newEquipment.id } });
    // console.log("Equipment deleted");
  } catch (error) {
    console.error("ORM Error:", error);
  } finally {
    await sequelize.close();
  }
}

runORMQueries();
