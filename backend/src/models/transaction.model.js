import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "INVESTMENT",
        "ROI",
        "REFERRAL_INCOME",
        "WITHDRAWAL",
        "DEPOSIT",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },

    description: {
      type: String,
      trim: true,
    },

    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      default: null,
    },

    referralIncome: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralIncome",
      default: null,
    },

    roiHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ROIHistory",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema);