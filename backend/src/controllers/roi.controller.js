import * as roiService from "../services/roi.service.js";

export const runROI = async (req, res) => {
  try {
    const result = await roiService.processDailyROI();

    return res.status(200).json({
      success: true,
      message: "Daily ROI processed successfully.",
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
    const history = await roiService.getROIHistory(req.user._id);

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};