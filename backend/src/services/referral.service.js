import User from "../models/user.model.js";
import ReferralIncome from "../models/referralIncome.model.js";

export const getDirectReferrals = async (userId) => {
  return await User.find({
    referredBy: userId,
  }).select("-password");
};

export const getReferralIncomeHistory = async (userId) => {
  return await ReferralIncome.find({
    receiver: userId,
  })
    .populate("generatedBy", "fullName email")
    .sort({ createdAt: -1 });
};

export const getReferralTree = async (userId) => {
  const buildTree = async (parentId) => {
    const children = await User.find({
      referredBy: parentId,
    }).select("fullName email referralCode");

    const tree = [];

    for (const child of children) {
      tree.push({
        user: child,
        referrals: await buildTree(child._id),
      });
    }

    return tree;
  };

  return await buildTree(userId);
};