import User from "../models/user.model.js";
import Deposit from "../models/deposit.model.js";
import Investment from "../models/investment.model.js";
import Withdrawal from "../models/withdrawal.model.js";
import Transaction from "../models/transaction.model.js";

/**
 * Get Wallet Summary
 */
export const getWalletSummary = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const [
    totalDeposit,
    totalInvestment,
    totalWithdrawal,
    transactions,
  ] = await Promise.all([
    Deposit.aggregate([
      {
        $match: {
          user: user._id,
          status: "Approved",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),

    Investment.aggregate([
      {
        $match: {
          user: user._id,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),

    Withdrawal.aggregate([
      {
        $match: {
          user: user._id,
          status: "Approved",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),

    Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return {
    walletBalance: user.walletBalance,

    totalDeposit: totalDeposit[0]?.total || 0,

    totalInvestment: totalInvestment[0]?.total || 0,

    totalWithdrawal: totalWithdrawal[0]?.total || 0,

    totalROI: user.totalROIEarned,

    totalReferral: user.totalLevelIncomeEarned,

    recentTransactions: transactions,
  };
};

/**
 * Wallet History
 */
export const getWalletHistory = async (userId) => {
  return await Transaction.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};