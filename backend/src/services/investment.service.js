import Investment from "../models/investment.model.js";
import Transaction from "../models/transaction.model.js";
import { processReferralIncome } from "../utils/processReferralIncome.js";
export const createInvestment = async (userId, data) => {
  const {
    amount,
    planName,
    dailyROIPercentage,
    duration,
  } = data;

  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);

  const investment = await Investment.create({
  user: userId,
  amount,
  planName,
  dailyROIPercentage,
  duration,
  startDate,
  endDate,
  status: "Active",
});

await processReferralIncome(userId, amount);

  await Transaction.create({
    user: userId,
    type: "INVESTMENT",
    amount,
    investment: investment._id,
    description: `Investment in ${planName}`,
  });

  return investment;
};

export const getUserInvestments = async (userId) => {
  return await Investment.find({ user: userId }).sort({
    createdAt: -1,
  });
};

export const getInvestmentById = async (investmentId, userId) => {
  return await Investment.findOne({
    _id: investmentId,
    user: userId,
  });
};

export const cancelInvestment = async (investmentId, userId) => {
  return await Investment.findOneAndUpdate(
    {
      _id: investmentId,
      user: userId,
    },
    {
      status: "Cancelled",
    },
    {
      new: true,
    }
  );
};

// Admin - Get all investments
export const getAllInvestments = async () => {
  return await Investment.find()
    .populate("user", "fullName email mobileNumber")
    .sort({ createdAt: -1 });
};

// Admin - Get investment details
export const getAdminInvestmentById = async (id) => {
  const investment = await Investment.findById(id).populate(
    "user",
    "fullName email mobileNumber walletBalance"
  );

  if (!investment) {
    throw new Error("Investment not found");
  }

  return investment;
};

// Admin - Complete investment
export const completeInvestment = async (id) => {
  const investment = await Investment.findById(id);

  if (!investment) {
    throw new Error("Investment not found");
  }

  investment.status = "Completed";

  await investment.save();

  return investment;
};

// Admin - Cancel investment
export const adminCancelInvestment = async (id) => {
  const investment = await Investment.findById(id);

  if (!investment) {
    throw new Error("Investment not found");
  }

  investment.status = "Cancelled";

  await investment.save();

  return investment;
};