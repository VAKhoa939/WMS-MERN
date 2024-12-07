import {
  deleteUser,
  getAllUsers,
  getUserById,
  isActive,
  updateUser,
} from "../controllers/userController.js";
import {
  verifyToken,
  verifyTokenAndAdminAuth,
} from "../middleware/middleware.js";
import express from "express";
const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/active/:id", verifyTokenAndAdminAuth, isActive);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyTokenAndAdminAuth, deleteUser);

export default router;
