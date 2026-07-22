import { body, validationResult } from "express-validator";

export const validateDeposit = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 100 })
    .withMessage("Minimum deposit is ₹100"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment Method is required")
    .isIn(["BANK", "UPI"])
    .withMessage("Invalid payment method"),

  body("transactionId")
    .trim()
    .notEmpty()
    .withMessage("Transaction ID is required"),

  body("bankName").optional(),

  body("accountHolderName").optional(),

  body("accountNumber").optional(),

  body("ifscCode").optional(),

  body("upiId").optional(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];