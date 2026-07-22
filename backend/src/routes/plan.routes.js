import express from "express";
import {
  getPlans,
  getPlanById,
} from "../controllers/plan.controller.js";

const router = express.Router();

// Get All Plans
router.get("/", getPlans);

// Get Single Plan
router.get("/:id", getPlanById);

export default router;