import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  logout,
  refreshUserToken,
} from "../controllers/authController";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please try again later." },
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refreshUserToken);

export default router;
