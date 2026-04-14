require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// global middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

// initialize db and start Server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("DB connection established");

    await sequelize.sync();
    console.log("Tables synchronized");

    app.listen(PORT, () => {
      console.log(`API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
