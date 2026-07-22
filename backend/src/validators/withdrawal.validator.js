export const validateWithdrawal = (req, res, next) => {
  try {
    const {
      amount,
      paymentMethod,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      upiId,
    } = req.body;

    // Amount Validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid withdrawal amount is required.",
      });
    }

    // Payment Method Validation
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    if (!["BANK", "UPI"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Payment method must be either BANK or UPI.",
      });
    }

    // BANK Validation
    if (paymentMethod === "BANK") {
      if (!bankName) {
        return res.status(400).json({
          success: false,
          message: "Bank name is required.",
        });
      }

      if (!accountHolderName) {
        return res.status(400).json({
          success: false,
          message: "Account holder name is required.",
        });
      }

      if (!accountNumber) {
        return res.status(400).json({
          success: false,
          message: "Account number is required.",
        });
      }

      if (!ifscCode) {
        return res.status(400).json({
          success: false,
          message: "IFSC code is required.",
        });
      }
    }

    // UPI Validation
    if (paymentMethod === "UPI") {
      if (!upiId) {
        return res.status(400).json({
          success: false,
          message: "UPI ID is required.",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};