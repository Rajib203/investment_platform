import api from "./api";

// Create withdrawal
export const createWithdrawal = (data) =>
  api.post("/withdrawals", data);

// User withdrawal history
export const getMyWithdrawals = () =>
  api.get("/withdrawals");

// Alias for Dashboard
export const getWithdrawals = () =>
  api.get("/withdrawals");

// User single withdrawal
export const getWithdrawalById = (id) =>
  api.get(`/withdrawals/${id}`);

// // Admin - All withdrawals
// export const getAllWithdrawals = () =>
//   api.get("/withdrawals/admin");

// // Admin - Single withdrawal
// export const getAdminWithdrawalById = (id) =>
//   api.get(`/withdrawals/admin/${id}`);

// // Approve
// export const approveWithdrawal = (id) =>
//   api.patch(`/withdrawals/admin/${id}/approve`);

// // Reject
// export const rejectWithdrawal = (id, remark) =>
//   api.patch(`/withdrawals/admin/${id}/reject`, {
//     remark,
//   });