import * as authService from "../services/auth.service.js";
import generateToken from "../utils/generateToken.js";
import { sendWelcomeEmail } from "../services/notification.service.js";

/* ==========================================
   Register
========================================== */

/* ==========================================
   Register (Regular User)
========================================== */

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    try {
      await sendWelcomeEmail(user);
    } catch (error) {
      console.log("Email Error:", error.message);
    }

    // ❌ DO NOT generate or return a JWT token here

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please log in.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Login
========================================== */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser(email, password);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Profile
========================================== */

export const profile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/* ==========================================
   Forgot Password
========================================== */

export const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   Reset Password
========================================== */

export const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
  console.log(error);

  return res.status(400).json({
    success: false,
    message: error.message,
    error,
  });
}
};
/* ==========================================
   Register Admin
========================================== */

/* ==========================================
   Register Admin
========================================== */
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, adminSecret } = req.body;

    // Optional Security Check
    if (process.env.ADMIN_SECRET && adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret key authorization.",
      });
    }

    const user = await authService.registerUser({
      fullName,
      email,
      mobileNumber,
      password,
      role: "ADMIN",
    });

    // Return success without returning an authentication token
    res.status(201).json({
      success: true,
      message: "Admin account registered successfully. Please proceed to login.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};