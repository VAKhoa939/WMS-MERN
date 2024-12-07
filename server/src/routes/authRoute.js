import {
  loginUser,
  registerUser,
  refreshToken,
  resetPassword,
  logoutUser,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/middleware.js";
import { Router } from "express";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/reset", resetPassword);

export default router;
