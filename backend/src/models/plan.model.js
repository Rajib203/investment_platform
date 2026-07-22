import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dailyROIPercentage: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Plan", planSchema);