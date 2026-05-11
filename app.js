require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const logger = require("./utils/logger");

const app = express();

app.use(helmet());

// 100 requests / 15 min
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Request limit." },
});
app.use("/api", globalLimiter);

// global middleware
app.use(cors());
app.use(express.json());

// Morgan log and send to Winston
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// middleware for response time
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `Performance: ${req.method} ${req.url} completed in ${duration}ms`,
    );
  });
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// server status
app.get("/status", (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  res.json({
    uptime,
    memoryUsage,
  });
});

// error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info("DB connection established");

    await sequelize.sync();
    logger.info("Tables synchronized");

    app.listen(PORT, () => {
      logger.info(`API Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server: " + error);
  }
}

startServer();
