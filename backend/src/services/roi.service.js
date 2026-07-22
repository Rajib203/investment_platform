import Investment from "../models/investment.model.js";
import User from "../models/user.model.js";
import ROIHistory from "../models/roiHistory.model.js";
import Transaction from "../models/transaction.model.js";
import { sendROIEmail } from "./notification.service.js";

export const processDailyROI = async () => {
  const investments = await Investment.find({
    status: "Active",
  });

  for (const investment of investments) {
    // Stop ROI after plan expires
    if (investment.endDate < new Date()) {
      investment.status = "Completed";
      await investment.save();
      continue;
    }

    const roi =
      (investment.amount * investment.dailyROIPercentage) / 100;

    const user = await User.findById(investment.user);

    if (!user) continue;

    // Update Wallet
    user.walletBalance += roi;
    user.totalROIEarned += roi;

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
    });

    // Create Transaction
    await Transaction.create({
      user: user._id,
      type: "ROI",
      amount: roi,
      description: "Daily ROI credited",
    });
  }

  return {
    success: true,
    message: "ROI distributed successfully",
  };
};

export const getROIHistory = async (userId) => {
  return await ROIHistory.find({ user: userId })
    .populate("investment")
    .sort({ createdAt: -1 });
};