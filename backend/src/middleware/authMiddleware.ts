import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRole } from "../models/User";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "hardcoded_secret";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ message: "Access denied. Invalid or expired token." });
  }
};

export const requireRole = (requiredRole: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role === "Admin") {
      return next();
    }

    if (req.user?.role !== requiredRole) {
      res
        .status(403)
        .json({ message: `Access denied. ${requiredRole} rights required.` });
      return;
    }

    next();
  };
};
