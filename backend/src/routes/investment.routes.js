import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
  createInvestment,
  getUserInvestments,
  getInvestmentById,
  cancelInvestment,
} from "../controllers/investment.controller.js";
import {
  getAllInvestments,
  getAdminInvestmentById,
  completeInvestment,
  adminCancelInvestment,
} from "../controllers/investment.controller.js";


const router = express.Router();

router.post("/", authMiddleware, createInvestment);

router.get("/", authMiddleware, getUserInvestments);

// Admin Routes

router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllInvestments
);

router.get(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  getAdminInvestmentById
);

router.patch(
  "/admin/:id/complete",
  authMiddleware,
  adminMiddleware,
  completeInvestment
);

router.patch(
  "/admin/:id/cancel",
  authMiddleware,
  adminMiddleware,
  adminCancelInvestment
);

router.get("/:id", authMiddleware, getInvestmentById);

router.patch("/:id/cancel", authMiddleware, cancelInvestment);

export default router;