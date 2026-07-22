import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getDirectReferrals,
  getReferralTree,
  getReferralIncomeHistory,
} from "../controllers/referral.controller.js";

const router = express.Router();

router.get("/direct", authMiddleware, getDirectReferrals);

router.get("/tree", authMiddleware, getReferralTree);

router.get("/income", authMiddleware, getReferralIncomeHistory);

export default router;