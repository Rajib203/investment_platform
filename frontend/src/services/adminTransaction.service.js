import api from "./api";

/* ==========================================================================
   ADMIN TRANSACTION APIs
   ========================================================================== */

/**
 * Fetch all system transactions across all users with optional filtering
 * @param {Object} [params] - Query options e.g. { page: 1, limit: 10, type: 'DEPOSIT', search: 'TXN123' }
 */
export const getAllTransactions = (params = {}) => {
  return api.get("/admin/transactions", { params });
};

/**
 * Fetch transactions for a specific user ID (Admin view)
 * @param {string} userId - Object ID of the user
 * @param {Object} [params] - Pagination & filter parameters
 */
export const getUserTransactionsAdmin = (userId, params = {}) => {
  return api.get(`/admin/transactions/user/${userId}`, { params });
};

/**
 * Fetch detailed view for a single transaction by ID
 * @param {string} transactionId - Object ID or Transaction Hash
 */
export const getTransactionByIdAdmin = (transactionId) => {
  return api.get(`/admin/transactions/${transactionId}`);
};

/**
 * Export transactions to CSV/Excel format (if supported on backend)
 * @param {Object} [params] - Filters to narrow down export
 */
export const exportTransactionsCSV = (params = {}) => {
  return api.get("/admin/transactions/export", {
    params,
    responseType: "blob", // Handles file downloads
  });
};