import { Response } from "express";
import { validationResult } from "express-validator";
import Equipment, { EquipmentStatus } from "../models/Equipment";
import MaintenanceLog from "../models/MaintenanceLog";
import { AuthRequest } from "../middleware/authMiddleware";

export const createEquipment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, serial_number, next_maintenance, status } = req.body;

    const existingEquipment = await Equipment.findOne({
      where: { serial_number },
    });
    if (existingEquipment) {
      res
        .status(400)
        .json({ message: "Equipment with this serial number already exists" });
      return;
    }

    const newEquipment = await Equipment.create({
      name,
      serial_number,
      next_maintenance,
      status: status || EquipmentStatus.ACTIVE,
    });

    res.status(201).json({
      message: "Equipment created successfully",
      equipment: newEquipment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating equipment" });
  }
};

export const getAllEquipment = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const equipment = await Equipment.findAll();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving equipment catalog" });
  }
};

export const getEquipmentById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const equipment = await Equipment.findByPk(Number(req.params.id), {
      include: [{ model: MaintenanceLog, as: "logs" }],
    });

    if (!equipment) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving equipment details" });
  }
};

export const reportIssue = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const equipment = await Equipment.findByPk(Number(req.params.id));
    if (!equipment) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }

    equipment.status = EquipmentStatus.WARNING;
    await equipment.save();

    res.json({
      message: "Issue reported successfully. Status updated to Warning.",
      equipment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error reporting issue" });
  }
};

export const logMaintenance = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { description, newStatus } = req.body;
    const equipmentId = Number(req.params.id);

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }

    if (newStatus && Object.values(EquipmentStatus).includes(newStatus)) {
      equipment.status = newStatus;
      await equipment.save();
    }

    await MaintenanceLog.create({
      equipment_id: equipmentId,
      user_id: req.user!.id,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      description,
    });

    res.status(201).json({
      message: "Maintenance log created successfully",
      status: equipment.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging maintenance" });
  }
};
