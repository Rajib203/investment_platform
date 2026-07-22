import api from "./api";

// Get user's ROI history
export const getROIHistory = () =>
  api.get("/roi/history");

// Admin: Run ROI manually
export const runROI = () =>
  api.post("/roi/run");