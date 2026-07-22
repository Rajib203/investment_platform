import * as depositService from "../services/deposit.service.js";
import User from "../models/user.model.js";

import {
  sendDepositRequestEmail,
  sendDepositApprovedEmail,
  sendDepositRejectedEmail,
} from "../services/notification.service.js";

/* ===================================
   Create Deposit
=================================== */

export const createDeposit = async (req, res) => {
  try {
    const screenshot =
      req.file ||
      (req.files?.paymentScreenshot
        ? req.files.paymentScreenshot[0]
        : null);

    const deposit = await depositService.createDeposit(
      req.user._id,
      req.body,
      screenshot
    );

    const user = await User.findById(req.user._id);

    try {
      await sendDepositRequestEmail(user, deposit);
    } catch (error) {
      console.log("Deposit Email Error:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "Deposit request submitted successfully.",
      data: deposit,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   User Deposit History
=================================== */

export const getMyDeposits = async (req, res) => {
  try {
    const deposits = await depositService.getMyDeposits(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      count: deposits.length,
      data: deposits,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   Single Deposit
=================================== */

export const getDepositById = async (req, res) => {
  try {
    const deposit = await depositService.getDepositById(
      req.user._id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: deposit,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   Admin - All Deposits
=================================== */

export const getAllDeposits = async (req, res) => {
  try {
    const deposits =
      await depositService.getAllDeposits();

    return res.status(200).json({
      success: true,
      count: deposits.length,
      data: deposits,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   Admin - Approve Deposit
=================================== */

export const approveDeposit = async (req, res) => {
  try {
    const deposit =
      await depositService.approveDeposit(
        req.params.id,
        req.user._id
      );

    const user = await User.findById(deposit.user);

    try {
      await sendDepositApprovedEmail(
        user,
        deposit
      );
    } catch (error) {
      console.log(
        "Approval Email Error:",
        error.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Deposit approved successfully.",
      data: deposit,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   Admin - Reject Deposit
=================================== */

export const rejectDeposit = async (req, res) => {
  try {
    const deposit =
      await depositService.rejectDeposit(
        req.params.id,
        req.user._id,
        req.body.remark
      );

    const user = await User.findById(deposit.user);

    try {
      await sendDepositRejectedEmail(
        user,
        deposit
      );
    } catch (error) {
      console.log(
        "Rejection Email Error:",
        error.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Deposit rejected successfully.",
      data: deposit,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};