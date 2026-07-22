import crypto from "crypto";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/email.js";

/* ==========================================
   Register User
========================================== */

/* ==========================================
   Register User
========================================== */

export const registerUser = async (userData) => {
  const {
    fullName,
    email,
    mobileNumber,
    password,
    role,
    referralCode,
  } = userData;

  // Check existing user
  const existingUser = await User.findOne({
    $or: [
      { email },
      { mobileNumber },
    ],
  });

  if (existingUser) {
    throw new Error(
      "User with this email or mobile number already exists."
    );
  }

  // Find Sponsor
  let referredBy = null;

  if (referralCode && referralCode.trim() !== "") {
    const sponsor = await User.findOne({
      referralCode: referralCode.trim().toUpperCase(),
    });

    if (!sponsor) {
      throw new Error("Invalid Referral Code");
    }

    referredBy = sponsor._id;
  }

  // Create User
  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    role: role || "USER",
    referredBy,
  });

  return user;
};

/* ==========================================
   Login User
========================================== */

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

/* ==========================================
   Forgot Password
========================================== */

export const forgotPassword = async (email) => {
  console.log("1");

  const user = await User.findOne({ email });

  console.log("2");

  if (!user) {
    throw new Error("User not found");
  }

  console.log("3");

  const resetToken = user.getResetPasswordToken();

  console.log("4");

  await user.save({
    validateBeforeSave: false,
  });

  console.log("5");

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  console.log("6");

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `<h1>${resetUrl}</h1>`,
  });

  console.log("7");

  return {
    message: "Password reset email sent successfully.",
  };
};
/* ==========================================
   Reset Password
========================================== */

export const resetPassword = async (
  token,
  password
) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.password = password;

  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();

  return {
    message: "Password reset successfully.",
  };
};
