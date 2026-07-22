import User from "../models/user.model.js";
import Investment from "../models/investment.model.js";
import Withdrawal from "../models/withdrawal.model.js";
import ROIHistory from "../models/roiHistory.model.js";

export const getDashboardAnalytics = async () => {
  const totalUsers = await User.countDocuments();

  const activeUsers = await User.countDocuments({
    accountStatus: "Active",
  });

  const blockedUsers = await User.countDocuments({
    accountStatus: "Blocked",
  });

  const totalInvestments = await Investment.countDocuments();

  const totalInvestmentAmount = await Investment.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalROI = await ROIHistory.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const pendingWithdrawals = await Withdrawal.countDocuments({
    status: "Pending",
  });

  const approvedWithdrawals = await Withdrawal.countDocuments({
    status: "Approved",
  });

  const rejectedWithdrawals = await Withdrawal.countDocuments({
    status: "Rejected",
  });

  const totalWithdrawalAmount = await Withdrawal.aggregate([
    {
      $match: {
        status: "Approved",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalWalletBalance = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$walletBalance" },
      },
    },
  ]);

  return {
    totalUsers,
    activeUsers,
    blockedUsers,
    totalInvestments,

    totalInvestmentAmount:
      totalInvestmentAmount[0]?.total || 0,

    totalROI:
      totalROI[0]?.total || 0,

    pendingWithdrawals,
    approvedWithdrawals,
    rejectedWithdrawals,

    totalWithdrawalAmount:
      totalWithdrawalAmount[0]?.total || 0,

    totalWalletBalance:
      totalWalletBalance[0]?.total || 0,
  };
};