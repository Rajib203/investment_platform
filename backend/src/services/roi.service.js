import Investment from "../models/investment.model.js";
import User from "../models/user.model.js";
import ROIHistory from "../models/roiHistory.model.js";
import Transaction from "../models/transaction.model.js";
import { sendROIEmail } from "./notification.service.js";

export const processDailyROI = async () => {
  const investments = await Investment.find({
    status: "Active",
  });

  let distributedCount = 0;
  let totalDistributedAmount = 0;

  for (const investment of investments) {
    // Stop ROI after plan expires
    if (investment.endDate && new Date(investment.endDate) < new Date()) {
      investment.status = "Completed";
      await investment.save();
      continue;
    }

    const roi =
      (investment.amount * investment.dailyROIPercentage) / 100;

    const user = await User.findById(investment.user);

    if (!user) continue;

    // Update Wallet
    user.walletBalance = (user.walletBalance || 0) + roi;
    user.totalROIEarned = (user.totalROIEarned || 0) + roi;

    await user.save();

    // Send ROI Email
    try {
      await sendROIEmail(user, roi);
    } catch (error) {
      console.log("ROI Email Error:", error.message);
    }

    // Save ROI History
    await ROIHistory.create({
      user: user._id,
      investment: investment._id,
      amount: roi,
      percentage: investment.dailyROIPercentage,
      date: new Date(),
    });

    // Create Transaction
    await Transaction.create({
      user: user._id,
      type: "ROI",
      amount: roi,
      description: `Daily ROI credited for ${investment.planName || "Investment"}`,
    });

    distributedCount++;
    totalDistributedAmount += roi;
  }

  return {
    success: true,
    message: `Daily ROI distributed successfully to ${distributedCount} active investment(s). Total: ₹${totalDistributedAmount.toFixed(2)}`,
    distributedCount,
    totalDistributedAmount,
  };
};

export const getROIHistory = async (userId) => {
  const history = await ROIHistory.find({ user: userId })
    .populate({
      path: "investment",
      select: "planName amount dailyROIPercentage startDate endDate status duration",
    })
    .sort({ createdAt: -1 });

  const user = await User.findById(userId).select("walletBalance totalROIEarned fullName email");
  const activeInvestments = await Investment.find({ user: userId, status: "Active" });

  const totalROIEarned = user?.totalROIEarned || 0;
  const activeInvestmentTotal = activeInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const expectedDailyROI = activeInvestments.reduce(
    (sum, inv) => sum + ((inv.amount * inv.dailyROIPercentage) / 100),
    0
  );

  // Today's ROI
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayROI = history
    .filter((h) => new Date(h.createdAt || h.date) >= startOfToday)
    .reduce((sum, h) => sum + (h.amount || 0), 0);

  return {
    history,
    summary: {
      totalROIEarned,
      todayROI,
      activeInvestmentTotal,
      activeInvestmentsCount: activeInvestments.length,
      expectedDailyROI,
      totalReturnsCount: history.length,
      walletBalance: user?.walletBalance || 0,
    },
    activeInvestments,
  };
};