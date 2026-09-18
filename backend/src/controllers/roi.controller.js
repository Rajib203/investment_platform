import * as roiService from "../services/roi.service.js";

export const runROI = async (req, res) => {
  try {
    const result = await roiService.processDailyROI();

    return res.status(200).json({
      success: true,
      message: result.message || "Daily ROI processed successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getROIHistory = async (req, res) => {
  try {
    const result = await roiService.getROIHistory(req.user._id);

    return res.status(200).json({
      success: true,
      count: result.history.length,
      data: result.history,
      summary: result.summary,
      activeInvestments: result.activeInvestments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};