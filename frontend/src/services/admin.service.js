import api from "./api";

export const getAdminDashboard = () =>
  api.get("/admin/dashboard");

export const getAllUsers = () =>
  api.get("/admin/users");

export const getAllInvestments = () =>
  api.get("/admin/investments");

export const getAllWithdrawals = () =>
  api.get("/admin/withdrawals");

export const getAllTransactions = () =>
  api.get("/admin/transactions");

export const blockUser = (id) =>
  api.patch(`/admin/users/${id}/block`);

export const unblockUser = (id) =>
  api.patch(`/admin/users/${id}/unblock`);

export const makeAdmin = (id) =>
  api.patch(`/admin/users/${id}/make-admin`);

export const removeAdmin = (id) =>
  api.patch(`/admin/users/${id}/remove-admin`);