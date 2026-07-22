import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { nanoid } from "nanoid";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // Forgot Password
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpire: {
      type: Date,
      default: null,
    },

    referralCode: {
      type: String,
      unique: true,
      default: () => nanoid(8).toUpperCase(),
      index: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    totalROIEarned: {
      type: Number,
      default: 0,
    },

    totalLevelIncomeEarned: {
      type: Number,
      default: 0,
    },

    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Blocked"],
      default: "Active",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);


/* ==========================================
   Hash Password Before Save
========================================== */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
/* ==========================================
   Compare Password
========================================== */

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* ==========================================
   Generate Reset Password Token
========================================== */

userSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save Hashed Token
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token Expire (15 Minutes)
  this.passwordResetExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;