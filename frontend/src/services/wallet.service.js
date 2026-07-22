import api from "./api";

/**
 * Get Wallet Summary
 */
export const getWalletSummary = () => {
  return api.get("/wallet");
};

/**
 * Get Wallet History
 */
export const getWalletHistory = () => {
  return api.get("/wallet/history");
};