import { verifyToken } from "../middleware/middleware.js";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { Router } from "express";
const router = Router();

router.post("/", verifyToken, createAddress);
router.get("/", verifyToken, getAllAddresses);
router.get("/:id", verifyToken, getAddressById);
router.put("/:id", verifyToken, updateAddress);
router.delete("/:id", verifyToken, deleteAddress);

export default router;
