import * as kycService from "../services/kyc.service.js";

/* ==========================
   User - Submit KYC
========================== */

export const submitKYC = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const kyc = await kycService.submitKYC(
      req.user._id,
      req.body,
      req.files
    );

    res.status(201).json({
      success: true,
      message: "KYC submitted successfully.",
      data: kyc,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/* ==========================
   User - Get My KYC
========================== */

export const getMyKYC = async (req, res) => {
  try {
    const kyc = await kycService.getMyKYC(req.user._id);

    res.status(200).json({
      success: true,
      data: kyc,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   User - Update My KYC
========================== */

export const updateMyKYC = async (req, res) => {
  try {
    const kyc = await kycService.updateMyKYC(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "KYC updated successfully.",
      data: kyc,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Admin - Get All KYC
========================== */

export const getAllKYC = async (req, res) => {
  try {
    const kycs = await kycService.getAllKYC();

    res.status(200).json({
      success: true,
      count: kycs.length,
      data: kycs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Admin - Get KYC By ID
========================== */

export const getKYCById = async (req, res) => {
  try {
    const kyc = await kycService.getKYCById(req.params.id);

    res.status(200).json({
      success: true,
      data: kyc,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Admin - Approve KYC
========================== */

export const approveKYC = async (req, res) => {
  try {
    const kyc = await kycService.approveKYC(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "KYC approved successfully.",
      data: kyc,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================
   Admin - Reject KYC
========================== */

export const rejectKYC = async (req, res) => {
  try {
    const { remark } = req.body;

    const kyc = await kycService.rejectKYC(req.params.id, req.user._id, remark);

    res.status(200).json({
      success: true,
      message: "KYC rejected successfully.",
      data: kyc,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
