const sequelize = require("./config/db");

async function executeQueries() {
  try {
    await sequelize.authenticate();
    console.log("Connection to the DB established");

    const [results, metadata] = await sequelize.query(
      "SELECT name, serial_number, status FROM equipment WHERE status = 'Maintenance';",
    );

    console.log("Query Results (Equipment on Maintenance):");
    console.table(results);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

executeQueries();
