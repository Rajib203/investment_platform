import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
  getDashboardAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Admin Dashboard Analytics
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardAnalytics
);

export default router;