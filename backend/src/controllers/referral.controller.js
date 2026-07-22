import * as referralService from "../services/referral.service.js";

export const getDirectReferrals = async (req, res) => {
  try {
    const referrals = await referralService.getDirectReferrals(req.user._id);

    return res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReferralTree = async (req, res) => {
  try {
    const tree = await referralService.getReferralTree(req.user._id);

    return res.status(200).json({
      success: true,
      data: tree,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReferralIncomeHistory = async (req, res) => {
  try {
    const history = await referralService.getReferralIncomeHistory(
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