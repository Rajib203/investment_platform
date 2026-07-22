import * as withdrawalService from "../services/withdrawal.service.js";
import User from "../models/user.model.js";

import {
  sendWithdrawalRequestEmail,
  sendWithdrawalApprovedEmail,
  sendWithdrawalRejectedEmail,
} from "../services/notification.service.js";

/* ==========================================
   Create Withdrawal
========================================== */

export const createWithdrawal = async (req, res) => {
  try {
    const withdrawal = await withdrawalService.createWithdrawal(
      req.user._id,
      req.body
    );

    const user = await User.findById(req.user._id);

    try {
      await sendWithdrawalRequestEmail(user, withdrawal);
    } catch (err) {
      console.log("Withdrawal Email Error:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "Withdrawal request created successfully.",
      data: withdrawal,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   User Withdrawal History
========================================== */

export const getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await withdrawalService.getMyWithdrawals(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      count: withdrawals.length,
      data: withdrawals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Get Single Withdrawal
   USER -> Own Withdrawal
   ADMIN -> Any Withdrawal
========================================== */

export const getWithdrawalById = async (req, res) => {
  try {
    let withdrawal;

    if (req.user.role === "ADMIN") {
      withdrawal = await withdrawalService.getWithdrawalByAdmin(
        req.params.id
      );
    } else {
      withdrawal = await withdrawalService.getWithdrawalById(
        req.user._id,
        req.params.id
      );
    }

    return res.status(200).json({
      success: true,
      data: withdrawal,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Admin - Get All Withdrawals
========================================== */

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals =
      await withdrawalService.getAllWithdrawals();

    return res.status(200).json({
      success: true,
      count: withdrawals.length,
      data: withdrawals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Admin - Approve Withdrawal
========================================== */

export const approveWithdrawal = async (req, res) => {
  try {
    const withdrawal =
      await withdrawalService.approveWithdrawal(
        req.params.id,
        req.user._id
      );

    const user = await User.findById(withdrawal.user);

    try {
      await sendWithdrawalApprovedEmail(
        user,
        withdrawal
      );
    } catch (err) {
      console.log("Approval Email Error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Withdrawal approved successfully.",
      data: withdrawal,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Admin - Reject Withdrawal
========================================== */

export const rejectWithdrawal = async (req, res) => {
  try {
    const withdrawal =
      await withdrawalService.rejectWithdrawal(
        req.params.id,
        req.user._id,
        req.body.remark
      );

    const user = await User.findById(withdrawal.user);

    try {
      await sendWithdrawalRejectedEmail(
        user,
        withdrawal
      );
    } catch (err) {
      console.log("Rejection Email Error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Withdrawal rejected successfully.",
      data: withdrawal,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};