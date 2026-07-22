import * as walletService from "../services/wallet.service.js";

/**
 * Wallet Summary
 */
export const getWalletSummary = async (req, res) => {
  try {
    const wallet = await walletService.getWalletSummary(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Wallet History
 */
export const getWalletHistory = async (req, res) => {
  try {
    const history = await walletService.getWalletHistory(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};