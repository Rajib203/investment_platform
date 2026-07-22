import api from "./api";

/**
 * Submit KYC
 */
export const submitKYC = (formData) =>
  api.post("/kyc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/**
 * Get Logged-in User KYC
 */
export const getMyKYC = () =>
  api.get("/kyc/me");

/**
 * Get All KYC (Admin)
 */
export const getAllKYC = () =>
  api.get("/admin/kyc");

/**
 * Get Single KYC (Admin)
 */
export const getKYCById = (id) =>
  api.get(`/admin/kyc/${id}`);

/**
 * Approve KYC
 */
export const approveKYC = (id) =>
  api.patch(`/admin/kyc/${id}/approve`);

/**
 * Reject KYC
 */
export const rejectKYC = (id) =>
  api.patch(`/admin/kyc/${id}/reject`);