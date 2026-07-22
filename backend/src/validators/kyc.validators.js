import { body } from "express-validator";

export const submitKYCValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("pincode")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Invalid pincode"),

  body("aadhaarNumber")
    .matches(/^[2-9]{1}[0-9]{11}$/)
    .withMessage("Invalid Aadhaar Number"),

  body("panNumber")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage("Invalid PAN Number"),

  body("bankName")
    .trim()
    .notEmpty()
    .withMessage("Bank name is required"),

  body("accountHolderName")
    .trim()
    .notEmpty()
    .withMessage("Account holder name is required"),

  body("accountNumber")
    .isLength({ min: 8, max: 18 })
    .withMessage("Invalid account number"),

  body("ifscCode")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage("Invalid IFSC Code"),
];

export const rejectKYCValidator = [
  body("remark")
    .trim()
    .notEmpty()
    .withMessage("Remark is required"),
];