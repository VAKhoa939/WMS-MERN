import { exportDB } from "../controllers/exportDBController.js";
import { Router } from "express";
const router = Router();

router.get("/export", exportDB);

export default router;
