import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft, FaExchangeAlt, FaUser, FaRegClock, FaReceipt } from "react-icons/fa";
import { getTransactionByIdAdmin } from "../../services/adminTransaction.service";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getTransactionByIdAdmin(id);
      setTransaction(res.data.data || res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch transaction details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading transaction details...
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400">Transaction not found.</p>
        <button
          onClick={() => navigate("/admin/transactions")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const isUserPopulated = typeof transaction.userId === "object" && transaction.userId !== null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => navigate("/admin/transactions")}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <FaArrowLeft size={14} /> Back to All Transactions
      </button>

      {/* Main Container Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaReceipt className="text-indigo-500" size={20} /> Transaction Details
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">ID: {transaction._id}</p>
          </div>
          <div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                transaction.status === "Completed" || transaction.status === "Approved" || transaction.status === "Success"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : transaction.status === "Failed" || transaction.status === "Rejected"
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {transaction.status || "Completed"}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FaUser size={12} /> Account Information
            </h2>
            <div className="space-y-1">
              <p className="text-white font-medium text-base">
                {isUserPopulated ? transaction.userId.name : "N/A"}
              </p>
              <p className="text-slate-400 text-sm">
                {isUserPopulated ? transaction.userId.email : "No email available"}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                User ID: {isUserPopulated ? transaction.userId._id : transaction.userId || "N/A"}
              </p>
            </div>
          </div>

          {/* Payment Overview */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FaExchangeAlt size={12} /> Transaction Overview
            </h2>
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Amount</p>
              <p className="text-2xl font-bold text-emerald-400">
                ₹{Number(transaction.amount || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Type: <span className="text-white font-medium">{transaction.type}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-slate-950 p-5 rounded-lg border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-semibold text-white">Metadata Breakdown</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Reference / Txn Hash</span>
              <span className="text-slate-200 font-mono text-xs break-all">
                {transaction.transactionId || transaction._id}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-xs block">Payment Method</span>
              <span className="text-slate-200 font-medium">
                {transaction.paymentMethod || "Internal Balance"}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-xs block">Description</span>
              <span className="text-slate-200">
                {transaction.description || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-xs block">Date & Time</span>
              <span className="text-slate-200 flex items-center gap-1.5 text-xs">
                <FaRegClock size={12} className="text-slate-500" />
                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;