import { Router } from "express";
import { body } from "express-validator";
import { verifyToken, requireRole } from "../middleware/authMiddleware";
import { UserRole } from "../models/User";
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  reportIssue,
  logMaintenance,
} from "../controllers/equipmentController";

const router = Router();

// all authenticated users can view the catalog and details
router.get("/", verifyToken, getAllEquipment);
router.get("/:id", verifyToken, getEquipmentById);

// any authenticated user can report an issue
router.post("/:id/report", verifyToken, reportIssue);

// only Engineers can perform maintenance and create logs
router.post(
  "/:id/maintenance",
  verifyToken,
  requireRole(UserRole.ENGINEER),
  [
    body("description")
      .notEmpty()
      .withMessage("A description of the maintenance is required"),
    body("newStatus").optional().isString(),
  ],
  logMaintenance,
);

// only Admins can add new equipment to the catalog
router.post(
  "/",
  verifyToken,
  requireRole(UserRole.ADMIN),
  [
    body("name").notEmpty().withMessage("Equipment name is required"),
    body("serial_number").notEmpty().withMessage("Serial number is required"),
    body("next_maintenance")
      .notEmpty()
      .withMessage("Next maintenance date is required"), // YYYY-MM-DD
  ],
  createEquipment,
);

export default router;
