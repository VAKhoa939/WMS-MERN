import { importCSV } from "../controllers/importDBController.js";
import multer from "multer";
import express from "express";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/import", upload.single("file"), importCSV);

export default router;
