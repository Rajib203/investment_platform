import KYC from "../models/kyc.model.js";
import User from "../models/user.model.js";

import {
  sendKYCApprovedEmail,
  sendKYCRejectedEmail,
} from "./notification.service.js";

/* ==========================
   Submit KYC
========================== */

export const submitKYC = async (userId, data, files) => {
  const existingKYC = await KYC.findOne({
    user: userId,
  });

  if (existingKYC) {
    throw new Error("KYC already submitted");
  }

  const kyc = await KYC.create({
    user: userId,

    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country || "India",
    pincode: data.pincode,

    aadhaarNumber: data.aadhaarNumber,
    panNumber: data.panNumber,

    bankName: data.bankName,
    accountHolderName: data.accountHolderName,
    accountNumber: data.accountNumber,
    ifscCode: data.ifscCode,

    aadhaarFront: files?.aadhaarFront?.[0]?.path || "",
    aadhaarBack: files?.aadhaarBack?.[0]?.path || "",
    panCardImage: files?.panCardImage?.[0]?.path || "",
    selfieImage: files?.selfieImage?.[0]?.path || "",
  });

  return kyc;
};
/* ==========================
   Get My KYC
========================== */

export const getMyKYC = async (userId) => {
  const kyc = await KYC.findOne({
    user: userId,
  });

  if (!kyc) {
    throw new Error("KYC not found");
  }

  return kyc;
};

/* ==========================
   Update My KYC
========================== */

export const updateMyKYC = async (userId, data) => {
  const kyc = await KYC.findOne({
    user: userId,
  });

  if (!kyc) {
    throw new Error("KYC not found");
  }

  if (kyc.status === "Approved") {
    throw new Error("Approved KYC cannot be updated");
  }

  Object.assign(kyc, data);

  await kyc.save();

  return kyc;
};

/* ==========================
   Admin - Get All KYC
========================== */

export const getAllKYC = async () => {
  return await KYC.find()
    .populate("user", "fullName email mobileNumber")
    .populate("verifiedBy", "fullName email")
    .sort({ createdAt: -1 });
};

/* ==========================
   Admin - Get KYC By ID
========================== */

export const getKYCById = async (id) => {
  const kyc = await KYC.findById(id)
    .populate("user", "fullName email mobileNumber")
    .populate("verifiedBy", "fullName email");

  if (!kyc) {
    throw new Error("KYC not found");
  }

  return kyc;
};

/* ==========================
   Admin - Approve KYC
========================== */

export const approveKYC = async (id, adminId) => {
  const kyc = await KYC.findById(id);

  if (!kyc) {
    throw new Error("KYC not found");
  }

  if (kyc.status === "Approved") {
    throw new Error("KYC already approved");
  }

  kyc.status = "Approved";
  kyc.verifiedBy = adminId;
  kyc.verifiedAt = new Date();

  await kyc.save();

  const user = await User.findByIdAndUpdate(
    kyc.user,
    {
      isKYCVerified: true,
    },
    {
      new: true,
    }
  );

  // Send approval email
  if (user) {
    await sendKYCApprovedEmail(user);
  }

  return kyc;
};

/* ==========================
   Admin - Reject KYC
========================== */

export const rejectKYC = async (
  id,
  adminId,
  remark
) => {
  const kyc = await KYC.findById(id);

  if (!kyc) {
    throw new Error("KYC not found");
  }

  if (kyc.status === "Rejected") {
    throw new Error("KYC already rejected");
  }

  kyc.status = "Rejected";
  kyc.remark = remark || "";

  kyc.verifiedBy = adminId;
  kyc.verifiedAt = new Date();

  await kyc.save();

  const user = await User.findByIdAndUpdate(
    kyc.user,
    {
      isKYCVerified: false,
    },
    {
      new: true,
    }
  );

  // Send rejection email
  if (user) {
    await sendKYCRejectedEmail(
      user,
      remark
    );
  }

  return kyc;
};