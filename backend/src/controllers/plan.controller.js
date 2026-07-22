import * as planService from "../services/plan.service.js";

/**
 * Get All Active Plans
 * GET /api/v1/plans
 */
export const getPlans = async (req, res) => {
  try {
    const plans = await planService.getPlans();

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Single Plan
 * GET /api/v1/plans/:id
 */
export const getPlanById = async (req, res) => {
  try {
    const plan = await planService.getPlanById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};