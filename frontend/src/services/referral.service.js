import api from "./api";

// Direct Referrals
export const getDirectReferrals = () =>
  api.get("/referrals/direct");

// Referral Income History
export const getReferralIncomeHistory = () =>
  api.get("/referrals/income");

// Referral Tree
export const getReferralTree = () =>
  api.get("/referrals/tree");