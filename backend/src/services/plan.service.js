import Plan from "../models/plan.model.js";

/**
 * Get all active investment plans
 */
export const getPlans = async () => {
  return await Plan.find({
    status: true,
  }).sort({
    amount: 1,
  });
};

/**
 * Get plan by ID
 */
export const getPlanById = async (id) => {
  return await Plan.findById(id);
};