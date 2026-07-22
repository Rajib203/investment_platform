import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import investmentRoutes from "./routes/investment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import referralRoutes from "./routes/referral.routes.js";
import roiRoutes from "./routes/roi.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import kycRoutes from "./routes/kyc.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import planRoutes from "./routes/plan.routes.js";
import depositRoutes from "./routes/deposit.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

const app = express();

// Standard Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());

// API Base Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/investments", investmentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/referrals", referralRoutes);
app.use("/api/v1/roi", roiRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/withdrawals", withdrawalRoutes);
app.use("/api/v1/plans", planRoutes);

// Admin & Analytics Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/analytics", analyticsRoutes); // Mounted cleanly without path collision

// KYC, Uploads, Deposits & Wallet
app.use("/api/v1/kyc", kycRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/deposits", depositRoutes);
app.use("/api/v1/wallet", walletRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running...",
  });
});

// ⚠️ MUST BE LAST: Global Error Handler Middleware
app.use(errorHandler);

export default app;