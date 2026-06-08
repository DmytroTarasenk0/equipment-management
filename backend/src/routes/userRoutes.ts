import { Router } from "express";
import { body } from "express-validator";
import { verifyToken } from "../middleware/authMiddleware";
import {
  getAllUsers,
  getUserById,
  createUser,
  updatePassword,
  deleteUser,
  getProfile,
} from "../controllers/userController";

const router = Router();

// retrieve own profile
router.get("/me", verifyToken, getProfile);

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);

router.post(
  "/",
  verifyToken,
  [
    body("name")
      .isLength({ min: 2 })
      .withMessage("The username must be at least 2 characters long"),
    body("email").isEmail().withMessage("Wrong Email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("The password must be at least 6 characters long"),
  ],
  createUser,
);

router.put("/:id/password", verifyToken, updatePassword);
router.delete("/:id", verifyToken, deleteUser);

export default router;
