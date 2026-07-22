import Withdrawal from "../models/withdrawal.model.js";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

/* ==========================================
   Create Withdrawal Request
========================================== */

export const createWithdrawal = async (userId, data) => {
  const {
    amount,
    paymentMethod,
    bankName,
    accountHolderName,
    accountNumber,
    ifscCode,
    upiId,
  } = data;

  const amt = Number(amount);

  if (isNaN(amt) || amt <= 0) {
    throw new Error("Invalid withdrawal amount");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.walletBalance < amt) {
    throw new Error("Insufficient wallet balance");
  }

  const pendingWithdrawal = await Withdrawal.findOne({
    user: userId,
    status: "Pending",
  });

  if (pendingWithdrawal) {
    throw new Error(
      "You already have a pending withdrawal request"
    );
  }

  const withdrawal = await Withdrawal.create({
    user: userId,
    amount: amt,
    paymentMethod,
    bankName,
    accountHolderName,
    accountNumber,
    ifscCode,
    upiId,
  });

  return withdrawal;
};

/* ==========================================
   User Withdrawal History
========================================== */

export const getMyWithdrawals = async (userId) => {
  return await Withdrawal.find({ user: userId }).sort({
    createdAt: -1,
  });
};

/* ==========================================
   Get User Withdrawal
========================================== */

export const getWithdrawalById = async (
  userId,
  withdrawalId
) => {
  const withdrawal = await Withdrawal.findOne({
    _id: withdrawalId,
    user: userId,
  });

  if (!withdrawal) {
    throw new Error("Withdrawal not found");
  }

  return withdrawal;
};

/* ==========================================
   Admin Get Single Withdrawal
========================================== */

export const getWithdrawalByAdmin = async (
  withdrawalId
) => {
  const withdrawal = await Withdrawal.findById(
    withdrawalId
  ).populate("user", "fullName email mobileNumber");

  if (!withdrawal) {
    throw new Error("Withdrawal not found");
  }

  return withdrawal;
};

/* ==========================================
   Admin Get All Withdrawals
========================================== */

export const getAllWithdrawals = async () => {
  return await Withdrawal.find()
    .populate("user", "fullName email mobileNumber")
    .sort({ createdAt: -1 });
};

/* ==========================================
   Approve Withdrawal
========================================== */

export const approveWithdrawal = async (
  withdrawalId,
  adminId
) => {
  const withdrawal = await Withdrawal.findById(
    withdrawalId
  );

  if (!withdrawal) {
    throw new Error("Withdrawal not found");
  }

  if (withdrawal.status === "Approved") {
    throw new Error("Withdrawal already approved");
  }

  if (withdrawal.status === "Rejected") {
    throw new Error("Withdrawal already rejected");
  }

  const user = await User.findById(withdrawal.user);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.walletBalance < withdrawal.amount) {
    throw new Error("Insufficient wallet balance");
  }

  user.walletBalance -= withdrawal.amount;
  await user.save();

  withdrawal.status = "Approved";
  withdrawal.approvedBy = adminId;
  withdrawal.approvedAt = new Date();

  await withdrawal.save();

  await Transaction.create({
    user: user._id,
    type: "WITHDRAWAL",
    amount: withdrawal.amount,
    status: "SUCCESS",
    description: "Withdrawal Approved",
  });

  return await Withdrawal.findById(withdrawal._id).populate(
    "user",
    "fullName email mobileNumber"
  );
};

/* ==========================================
   Reject Withdrawal
========================================== */

export const rejectWithdrawal = async (
  withdrawalId,
  adminId,
  remark
) => {
  const withdrawal = await Withdrawal.findById(
    withdrawalId
  );

  if (!withdrawal) {
    throw new Error("Withdrawal not found");
  }

  if (withdrawal.status === "Approved") {
    throw new Error("Withdrawal already approved");
  }

  if (withdrawal.status === "Rejected") {
    throw new Error("Withdrawal already rejected");
  }

  withdrawal.status = "Rejected";
  withdrawal.approvedBy = adminId;
  withdrawal.approvedAt = new Date();
  withdrawal.remark = remark || "Rejected by Admin";

  await withdrawal.save();

  await Transaction.create({
    user: withdrawal.user,
    type: "WITHDRAWAL",
    amount: withdrawal.amount,
    status: "FAILED",
    description: "Withdrawal Rejected",
  });

  return await Withdrawal.findById(withdrawal._id).populate(
    "user",
    "fullName email mobileNumber"
  );
};