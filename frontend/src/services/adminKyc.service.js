import api from "./api";

export const getAllKYC = () =>
  api.get("/admin/kyc");

export const getKYCById = (id) =>
  api.get(`/admin/kyc/${id}`);

export const approveKYC = (id) =>
  api.patch(`/admin/kyc/${id}/approve`);

export const rejectKYC = (id) =>
  api.patch(`/admin/kyc/${id}/reject`);