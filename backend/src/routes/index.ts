import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import equipmentRoutes from "./equipmentRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/equipment", equipmentRoutes);

export default router;
