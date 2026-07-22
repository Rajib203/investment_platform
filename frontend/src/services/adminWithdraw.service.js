import api from "./api";

// Get all withdrawal requests
export const getAllWithdrawals = () =>
  api.get("/withdrawals/admin");

// Get single withdrawal request by ID
export const getWithdrawalById = (id) =>
  api.get(`/withdrawals/admin/${id}`);

// Approve withdrawal
export const approveWithdrawal = (id) =>
  api.patch(`/withdrawals/admin/${id}/approve`);

// Reject withdrawal
export const rejectWithdrawal = (id, remark) =>
  api.patch(`/withdrawals/admin/${id}/reject`, {
    remark,
  });