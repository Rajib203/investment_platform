import * as adminService from "../services/admin.service.js";
import * as transactionService from "../services/transaction.service.js";

/* ==========================
   Dashboard
========================== */

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await adminService.getDashboard();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Users
========================== */

export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await adminService.blockUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User blocked successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await adminService.unblockUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Investments
========================== */

export const getAllInvestments = async (req, res) => {
  try {
    const investments = await adminService.getAllInvestments();

    return res.status(200).json({
      success: true,
      count: investments.length,
      data: investments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Withdrawals
========================== */

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await adminService.getAllWithdrawals();

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

/* ==========================
   Transactions
========================== */

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await adminService.getAllTransactions();

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("🔴 Backend Error in getAllTransactions Controller:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch transactions",
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await transactionService.getAdminTransactionById(id);

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Error in getTransactionById controller:", error);

    const statusCode = error.message === "Transaction not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch transaction details",
    });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const user = await adminService.makeAdmin(req.params.id);

    res.status(200).json({
      success: true,
      message: "User promoted to ADMIN",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const user = await adminService.removeAdmin(req.params.id);

    res.status(200).json({
      success: true,
      message: "Admin removed successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Plans
========================== */

export const getAllPlans = async (req, res) => {
  try {
    const plans = await adminService.getAllPlans();

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPlan = async (req, res) => {
  try {
    const plan = await adminService.createPlan(req.body);

    return res.status(201).json({
      success: true,
      message: "Plan created successfully.",
      data: plan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await adminService.updatePlan(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully.",
      data: plan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePlan = async (req, res) => {
  try {
    await adminService.deletePlan(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};