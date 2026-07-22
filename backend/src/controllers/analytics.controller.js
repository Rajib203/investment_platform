import * as analyticsService from "../services/analytics.service.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const analytics =
      await analyticsService.getDashboardAnalytics();

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};