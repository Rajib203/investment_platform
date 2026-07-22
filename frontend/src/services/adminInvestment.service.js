import api from "./api";

// Get all investments
export const getAllInvestments = () =>
  api.get("/investments/admin/all");

// Get investment details
export const getInvestmentById = (id) =>
  api.get(`/investments/admin/${id}`);

// Complete investment
export const completeInvestment = (id) =>
  api.patch(`/investments/admin/${id}/complete`);

// Cancel investment
export const cancelInvestment = (id) =>
  api.patch(`/investments/admin/${id}/cancel`);