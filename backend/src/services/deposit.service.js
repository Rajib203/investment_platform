import Deposit from "../models/deposit.model.js";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

/* ===================================
   Create Deposit Request
=================================== */

export const createDeposit = async (userId, data, file) => {
  const {
    amount,
    paymentMethod,
    transactionId,
    bankName,
    accountHolderName,
    accountNumber,
    ifscCode,
    upiId,
  } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (amount <= 0) {
    throw new Error("Invalid deposit amount");
  }

  const exists = await Deposit.findOne({
    transactionId,
  });

  if (exists) {
    throw new Error("Transaction ID already used");
  }

  const pending = await Deposit.findOne({
    user: userId,
    status: "Pending",
  });

  if (pending) {
    throw new Error("You already have one pending deposit request");
  }

  const deposit = await Deposit.create({
    user: userId,
    amount,
    paymentMethod,
    transactionId,
    bankName,
    accountHolderName,
    accountNumber,
    ifscCode,
    upiId,
    paymentScreenshot: file?.path || "",
  });

  return deposit;
};

/* ===================================
   User Deposit History
=================================== */

export const getMyDeposits = async (userId) => {
  return await Deposit.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

/* ===================================
   Single Deposit
=================================== */

export const getDepositById = async (
  userId,
  depositId
) => {
  const deposit = await Deposit.findOne({
    _id: depositId,
    user: userId,
  });

  if (!deposit) {
    throw new Error("Deposit not found");
  }

  return deposit;
};

/* ===================================
   Admin - Get All Deposits
=================================== */

export const getAllDeposits = async () => {
  return await Deposit.find()
    .populate(
      "user",
      "fullName email mobileNumber"
    )
    .populate(
      "approvedBy",
      "fullName email"
    )
    .sort({
      createdAt: -1,
    });
};

/* ===================================
   Admin - Approve Deposit
=================================== */

export const approveDeposit = async (
  depositId,
  adminId
) => {
  const deposit = await Deposit.findById(depositId);

  if (!deposit) {
    throw new Error("Deposit not found");
  }

  if (deposit.status !== "Pending") {
    throw new Error("Deposit already processed");
  }

  const user = await User.findById(deposit.user);

  if (!user) {
    throw new Error("User not found");
  }

  // Add money to wallet
  user.walletBalance += deposit.amount;

  await user.save();

  deposit.status = "Approved";
  deposit.approvedBy = adminId;
  deposit.approvedAt = new Date();

  await deposit.save();

  // Create Transaction
  await Transaction.create({
    user: user._id,
    type: "DEPOSIT",
    amount: deposit.amount,
    status: "SUCCESS",
    description: "Wallet Deposit Approved",
  });

  return deposit;
};

/* ===================================
   Admin - Reject Deposit
=================================== */

export const rejectDeposit = async (
  depositId,
  adminId,
  remark
) => {
  const deposit = await Deposit.findById(depositId);

  if (!deposit) {
    throw new Error("Deposit not found");
  }

  if (deposit.status !== "Pending") {
    throw new Error("Deposit already processed");
  }

  deposit.status = "Rejected";
  deposit.remark = remark || "Rejected by Admin";
  deposit.approvedBy = adminId;
  deposit.approvedAt = new Date();

  await deposit.save();

  return deposit;
};