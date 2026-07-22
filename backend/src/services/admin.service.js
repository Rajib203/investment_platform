import User from "../models/user.model.js";
import Investment from "../models/investment.model.js";
import Withdrawal from "../models/withdrawal.model.js";
import Transaction from "../models/transaction.model.js";
import Plan from "../models/plan.model.js"
/* ==========================
   Dashboard
========================== */

export const getDashboard = async () => {
  const [
    totalUsers,
    activeUsers,
    blockedUsers,
    totalInvestments,
    activeInvestments,
    completedInvestments,
    pendingWithdrawals,
    approvedWithdrawals,
    rejectedWithdrawals,
    recentUsers,
    recentInvestments,
    recentWithdrawals,
    recentTransactions,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({ accountStatus: "Active" }),

    User.countDocuments({ accountStatus: "Blocked" }),

    Investment.countDocuments(),

    Investment.countDocuments({ status: "Active" }),

    Investment.countDocuments({ status: "Completed" }),

    Withdrawal.countDocuments({ status: "Pending" }),

    Withdrawal.countDocuments({ status: "Approved" }),

    Withdrawal.countDocuments({ status: "Rejected" }),

    User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5),

    Investment.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5),

    Withdrawal.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5),

    Transaction.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const investmentStats = await Investment.aggregate([
    {
      $group: {
        _id: null,
        totalInvestmentAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const withdrawalStats = await Withdrawal.aggregate([
    {
      $match: {
        status: "Approved",
      },
    },
    {
      $group: {
        _id: null,
        totalWithdrawalAmount: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const walletStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalWalletBalance: {
          $sum: "$walletBalance",
        },
        totalROIPaid: {
          $sum: "$totalROIEarned",
        },
        totalReferralIncome: {
          $sum: "$totalLevelIncomeEarned",
        },
      },
    },
  ]);

  return {
    totalUsers,
    activeUsers,
    blockedUsers,

    totalInvestments,
    activeInvestments,
    completedInvestments,

    totalInvestmentAmount:
      investmentStats[0]?.totalInvestmentAmount || 0,

    totalWithdrawalAmount:
      withdrawalStats[0]?.totalWithdrawalAmount || 0,

    totalWalletBalance:
      walletStats[0]?.totalWalletBalance || 0,

    totalROIPaid:
      walletStats[0]?.totalROIPaid || 0,

    totalReferralIncome:
      walletStats[0]?.totalReferralIncome || 0,

    pendingWithdrawals,
    approvedWithdrawals,
    rejectedWithdrawals,

    recentUsers,
    recentInvestments,
    recentWithdrawals,
    recentTransactions,
  };
};

/* ==========================
   Users
========================== */

export const getAllUsers = async () => {
  return await User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const blockUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  user.accountStatus = "Blocked";

  await user.save();

  return user;
};

export const unblockUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  user.accountStatus = "Active";

  await user.save();

  return user;
};

/* ==========================
   Investments
========================== */

export const getAllInvestments = async () => {
  return await Investment.find()
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });
};

/* ==========================
   Withdrawals
========================== */

export const getAllWithdrawals = async () => {
  return await Withdrawal.find()
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });
};

/* ==========================
   Transactions
========================== */
export const getAllTransactions = async () => {
  try {
    // Make sure 'user' is populated (NOT 'userId')
    const transactions = await Transaction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return transactions;
  } catch (error) {
    console.error("🔴 Backend Error inside adminService.getAllTransactions:", error);
    throw error;
  }
};
/* ==========================
   Admin Role Management
========================== */

export const makeAdmin = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "ADMIN") {
    throw new Error("User is already an admin");
  }

  user.role = "ADMIN";

  await user.save();

  return user;
};

export const removeAdmin = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "USER") {
    throw new Error("User is not an admin");
  }

  user.role = "USER";

  await user.save();

  return user;
};

/* ==========================
   Plans
========================== */

export const getAllPlans = async () => {
  return await Plan.find().sort({ amount: 1 });
};

export const createPlan = async (data) => {
  return await Plan.create(data);
};

export const updatePlan = async (id, data) => {
  const plan = await Plan.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  return plan;
};

export const deletePlan = async (id) => {
  const plan = await Plan.findById(id);

  if (!plan) {
    throw new Error("Plan not found");
  }

  await plan.deleteOne();

  return plan;
};