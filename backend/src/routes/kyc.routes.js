import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  submitKYC,
  getMyKYC,
  updateMyKYC,
  getAllKYC,
  getKYCById,
  approveKYC,
  rejectKYC,
} from "../controllers/kyc.controller.js";

const router = express.Router();

/* ==========================
   User Routes
========================== */

// Submit KYC
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "selfieImage", maxCount: 1 },
  ]),
  submitKYC,
);
// Get My KYC
router.get("/me", authMiddleware, getMyKYC);

// Update My KYC
router.put("/me", authMiddleware, updateMyKYC);

/* ==========================
   Admin Routes
========================== */

// Get All KYC Requests
router.get("/admin/all", authMiddleware, adminMiddleware, getAllKYC);

// Get Single KYC
router.get("/admin/:id", authMiddleware, adminMiddleware, getKYCById);

// Approve KYC
router.patch("/admin/:id/approve", authMiddleware, adminMiddleware, approveKYC);

// Reject KYC
router.patch("/admin/:id/reject", authMiddleware, adminMiddleware, rejectKYC);

export default router;
