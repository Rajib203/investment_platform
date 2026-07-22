import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
  getDashboard,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  getAllInvestments,
  getAllWithdrawals,
  getAllTransactions,
  getTransactionById, // <-- 1. IMPORT THIS
  makeAdmin,
  removeAdmin,

  // Plans
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/admin.controller.js";

import {
  getAllKYC,
  getKYCById,
  approveKYC,
  rejectKYC,
} from "../controllers/kyc.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard
router.get("/dashboard", getDashboard);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);
router.patch("/users/:id/make-admin", makeAdmin);
router.patch("/users/:id/remove-admin", removeAdmin);

// Investments
router.get("/investments", getAllInvestments);

// Withdrawals
router.get("/withdrawals", getAllWithdrawals);

// Transactions
router.get("/transactions", getAllTransactions);
router.get("/transactions/:id", getTransactionById); // <-- 2. ADD THIS ROUTE

// Plans
router.get("/plans", getAllPlans);
router.post("/plans", createPlan);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);

// KYC
router.get("/kyc", getAllKYC);
router.get("/kyc/:id", getKYCById);
router.patch("/kyc/:id/approve", approveKYC);
router.patch("/kyc/:id/reject", rejectKYC);

export default router;