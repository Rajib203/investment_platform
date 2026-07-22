import * as investmentService from "../services/investment.service.js";
import { sendInvestmentEmail } from "../services/notification.service.js";
import User from "../models/user.model.js";

export const createInvestment = async (req, res) => {
  try {
    // Create Investment
    const investment = await investmentService.createInvestment(
      req.user._id,
      req.body
    );

    // Fetch User
    const user = await User.findById(req.user._id);

    // Send Investment Email
    try {
      await sendInvestmentEmail(user, investment);
    } catch (error) {
      console.error("Investment Email Error:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "Investment created successfully.",
      data: investment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserInvestments = async (req, res) => {
  try {
    const investments = await investmentService.getUserInvestments(
      req.user._id
    );

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

export const getInvestmentById = async (req, res) => {
  try {
    const investment = await investmentService.getInvestmentById(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelInvestment = async (req, res) => {
  try {
    const investment = await investmentService.cancelInvestment(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message: "Investment cancelled successfully.",
      data: investment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllInvestments = async (req, res) => {
  try {
    const investments = await investmentService.getAllInvestments();

    res.json({
      success: true,
      count: investments.length,
      data: investments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAdminInvestmentById = async (req, res) => {
  try {
    const investment = await investmentService.getAdminInvestmentById(
      req.params.id
    );

    res.json({
      success: true,
      data: investment,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const completeInvestment = async (req, res) => {
  try {
    const investment = await investmentService.completeInvestment(
      req.params.id
    );

    res.json({
      success: true,
      message: "Investment completed successfully",
      data: investment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const adminCancelInvestment = async (req, res) => {
  try {
    const investment = await investmentService.adminCancelInvestment(
      req.params.id
    );

    res.json({
      success: true,
      message: "Investment cancelled successfully",
      data: investment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};