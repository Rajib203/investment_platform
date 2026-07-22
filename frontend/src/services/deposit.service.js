import api from "./api";

/* ===========================
      USER APIs
=========================== */

// Create Deposit
export const createDeposit = (formData) =>
  api.post("/deposits", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// My Deposit History
export const getMyDeposits = () =>
  api.get("/deposits");

// Single Deposit
export const getDepositById = (id) =>
  api.get(`/deposits/${id}`);

/* ===========================
      ADMIN APIs
=========================== */

// All Deposits
export const getAllDeposits = () =>
  api.get("/deposits/admin/all");

// Approve Deposit
export const approveDeposit = (id) =>
  api.patch(`/deposits/admin/${id}/approve`);

// Reject Deposit
export const rejectDeposit = (id, remark) =>
  api.patch(`/deposits/admin/${id}/reject`, {
    remark,
  });