import { body } from "express-validator";

export const registerValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("mobileNumber")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];