import mongoose from "mongoose";

const depositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 100,
    },

    paymentMethod: {
      type: String,
      enum: ["BANK", "UPI"],
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },

    accountHolderName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    ifscCode: {
      type: String,
      default: "",
      uppercase: true,
    },

    upiId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },

    remark: {
      type: String,
      default: "",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Deposit", depositSchema);