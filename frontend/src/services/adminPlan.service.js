import api from "./api";

export const getPlans = () =>
  api.get("/admin/plans");

export const createPlan = (data) =>
  api.post("/admin/plans", data);

export const updatePlan = (id, data) =>
  api.put(`/admin/plans/${id}`, data);

export const deletePlan = (id) =>
  api.delete(`/admin/plans/${id}`);