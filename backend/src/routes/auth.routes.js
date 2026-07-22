import express from "express";

import {
  register,
  login,
  profile,
  forgotPassword,
  resetPassword,
  registerAdmin, // 👈 Added import
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/* ==========================================
   Authentication
========================================== */

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, profile);

/* ==========================================
   Forgot Password
========================================== */

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.post("/admin/register", registerAdmin); // 👈 Full URL: /api/v1/auth/admin/register

export default router;