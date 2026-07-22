import User from "../models/user.model.js";
import Investment from "../models/investment.model.js";

export const getDashboard = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const investments = await Investment.find({
    user: userId,
  });

  const totalInvestment = investments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const activeInvestments = investments.filter(
    (item) => item.status === "Active"
  ).length;

  // Count direct referrals
  const directReferrals = await User.countDocuments({
    referredBy: user._id,
  });

  return {
    totalInvestment,
    walletBalance: user.walletBalance,
    totalROIEarned: user.totalROIEarned,
    totalLevelIncomeEarned: user.totalLevelIncomeEarned,
    activeInvestments,

    // Referral Details
    referralCode: user.referralCode,
    referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`,
    directReferrals,
  };
};