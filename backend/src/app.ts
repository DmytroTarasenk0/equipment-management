import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { sequelize } from "./models";
import apiRoutes from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// swaggerUI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Request limit reached." },
});
app.use("/api", globalLimiter);

// global routes
app.use("/api", apiRoutes);

// health check
app.get("/status", (req: Request, res: Response) => {
  res.json({
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    status: "Server is healthy",
  });
});

// global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync();
    console.log("Database models synchronised.");

    app.listen(PORT, () => {
      console.log(`API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
