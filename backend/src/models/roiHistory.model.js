import mongoose from "mongoose";

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ROIHistory", roiHistorySchema);