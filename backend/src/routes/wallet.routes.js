import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  getWalletSummary,
  getWalletHistory,
} from "../controllers/wallet.controller.js";

const router = express.Router();

/* ===================================
   Wallet Summary
   GET /api/v1/wallet
=================================== */

router.get(
  "/",
  authMiddleware,
  getWalletSummary
);

/* ===================================
   Wallet History
   GET /api/v1/wallet/history
=================================== */

router.get(
  "/history",
  authMiddleware,
  getWalletHistory
);

export default router;