import api from "./api";

// Get All Investments
export const getInvestments = () => {
  return api.get("/investments");
};

// Create New Investment
export const createInvestment = (data) => {
  return api.post("/investments", data);
};

// Get Investment By ID
export const getInvestmentById = (id) => {
  return api.get(`/investments/${id}`);
};