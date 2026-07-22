import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      required: true,
    },

    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
    },

    panNumber: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    accountHolderName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
    },

    aadhaarFront: {
      type: String,
      default: "",
    },

    aadhaarBack: {
      type: String,
      default: "",
    },

    panCardImage: {
      type: String,
      default: "",
    },

    selfieImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    remark: {
      type: String,
      default: "",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isKYCVerified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("KYC", kycSchema);
