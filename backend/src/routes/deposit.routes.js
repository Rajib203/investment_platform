import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import upload from "../middleware/upload.middleware.js";

import { validateDeposit } from "../validators/deposit.validator.js";

import {
  createDeposit,
  getMyDeposits,
  getDepositById,
  getAllDeposits,
  approveDeposit,
  rejectDeposit,
} from "../controllers/deposit.controller.js";

const router = express.Router();

/* ==================================
            USER ROUTES
================================== */

// Create Deposit
router.post(
  "/",
  authMiddleware,
  upload.single("paymentScreenshot"),
  validateDeposit,
  createDeposit
);

// My Deposits
router.get(
  "/",
  authMiddleware,
  getMyDeposits
);

// Single Deposit
router.get(
  "/:id",
  authMiddleware,
  getDepositById
);

/* ==================================
            ADMIN ROUTES
================================== */

// All Deposits
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllDeposits
);

// Approve Deposit
router.patch(
  "/admin/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveDeposit
);

// Reject Deposit
router.patch(
  "/admin/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectDeposit
);

export default router;