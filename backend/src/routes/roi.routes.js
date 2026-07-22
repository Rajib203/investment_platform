import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  runROI,
  getROIHistory,
} from "../controllers/roi.controller.js";

const router = express.Router();

router.post("/run", runROI);
router.get("/history", authMiddleware, getROIHistory);

export default router;