import {
  createGoods,
  deleteGoods,
  getAllGoods,
  getAllGoodsByAddress,
  getAllGoodsByUser,
  getGoodsById,
  updateGoods,
} from "../controllers/goodsController.js";
import { verifyToken } from "../middleware/middleware.js";
import { Router } from "express";
const router = Router();

router.get("/", verifyToken, getAllGoods);
router.get("/:id", verifyToken, getGoodsById);
router.post("/", verifyToken, createGoods);
router.put("/:id", verifyToken, updateGoods);
router.delete("/:id", verifyToken, deleteGoods);
router.get("/user/:id", verifyToken, getAllGoodsByUser);
router.get("/address/:id", verifyToken, getAllGoodsByAddress);

export default router;
