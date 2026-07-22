import * as transactionService from "../services/transaction.service.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions(req.user._id);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};