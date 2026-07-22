import Transaction from "../models/transaction.model.js";
import mongoose from "mongoose";

// Get transactions for logged in user
export const getTransactions = async (userId) => {
  return await Transaction.find({ user: userId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

// Get single transaction by ID for a user
export const getTransactionById = async (transactionId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new Error("Invalid transaction ID format");
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId, // Enforces user ownership
  }).populate("user", "name email");

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
};

// ADMIN SERVICE METHOD: Get any transaction by ID without restricting to user
export const getAdminTransactionById = async (transactionId) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new Error("Invalid transaction ID format");
  }

  const transaction = await Transaction.findById(transactionId)
    .populate("user", "name email")
    .populate("investment")
    .populate("referralIncome");

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
};