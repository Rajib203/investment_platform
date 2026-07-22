import api from "./api";

export const register = (data) =>
  api.post("/auth/register", data);

export const login = (data) =>
  api.post("/auth/login", data);

export const profile = () =>
  api.get("/auth/profile");

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, {
    password,
  });