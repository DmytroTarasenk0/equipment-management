import { Response } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import NodeCache from "node-cache";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

const cache = new NodeCache({ stdTTL: 60 });

export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findByPk(req.user?.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile" });
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cachedUsers = cache.get("all_users");
    if (cachedUsers) {
      res.json({ source: "cache", data: cachedUsers });
      return;
    }

    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    cache.set("all_users", users);
    res.json({ source: "database", data: users });
  } catch (error) {
    res.status(500).json({ message: "Error getting users." });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findByPk(Number(req.params.id), {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "Email is already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Medic",
    });

    cache.del("all_users");
    res.status(201).json({ message: "User created", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updatePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(Number(req.params.id));

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect old password" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        message: "The new password must be at least 6 characters long",
      });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedNewPassword },
      { where: { id: req.params.id } },
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    cache.del("all_users");
    res.json({ message: "User successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
