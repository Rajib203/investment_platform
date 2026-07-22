import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import { validateWithdrawal } from "../validators/withdrawal.validator.js";

import {
  createWithdrawal,
  getMyWithdrawals,
  getWithdrawalById,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../controllers/withdrawal.controller.js";

const router = express.Router();

/* ===========================
   Admin Routes
   Full Path: /api/v1/withdrawals/admin/...
=========================== */

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAllWithdrawals
);

router.get(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  getWithdrawalById
);

router.patch(
  "/admin/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveWithdrawal
);

router.patch(
  "/admin/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectWithdrawal
);

/* ===========================
   User Routes
   Full Path: /api/v1/withdrawals/...
=========================== */

router.post(
  "/",
  authMiddleware,
  validateWithdrawal,
  createWithdrawal
);

router.get(
  "/",
  authMiddleware,
  getMyWithdrawals
);

// Generic :id route MUST remain at the bottom
router.get(
  "/:id",
  authMiddleware,
  getWithdrawalById
);

export default router;