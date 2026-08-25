import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft, FaExchangeAlt, FaUser, FaRegClock, FaReceipt } from "react-icons/fa";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
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
      <div className="flex min-h-screen bg-slate-50 text-slate-850">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-8 text-center text-slate-500 font-medium">
            Loading transaction details...
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-850">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-8 text-center space-y-4">
            <p className="text-slate-500 font-medium">Transaction not found.</p>
            <button
              onClick={() => navigate("/admin/transactions")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Back to Transactions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isUserPopulated = typeof transaction.userId === "object" && transaction.userId !== null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Top Navigation */}
          <button
            onClick={() => navigate("/admin/transactions")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
          >
            <FaArrowLeft size={14} /> Back to All Transactions
          </button>

          {/* Main Container Card */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FaReceipt className="text-indigo-650" size={20} /> Transaction Details
                </h1>
                <p className="text-xs font-mono text-slate-500 mt-1">ID: {transaction._id}</p>
              </div>
              <div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    transaction.status === "Completed" || transaction.status === "Approved" || transaction.status === "Success"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : transaction.status === "Failed" || transaction.status === "Rejected"
                      ? "bg-rose-100 text-rose-800 border-rose-200"
                      : "bg-amber-100 text-amber-850 border-amber-200"
                  }`}
                >
                  {transaction.status || "Completed"}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Details */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <FaUser size={12} /> Account Information
                </h2>
                <div className="space-y-1">
                  <p className="text-slate-900 font-bold text-base">
                    {isUserPopulated ? transaction.userId.name : "N/A"}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {isUserPopulated ? transaction.userId.email : "No email available"}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    User ID: {isUserPopulated ? transaction.userId._id : transaction.userId || "N/A"}
                  </p>
                </div>
              </div>

              {/* Payment Overview */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <FaExchangeAlt size={12} /> Transaction Overview
                </h2>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400">Amount</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ₹{Number(transaction.amount || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Type: <span className="text-slate-800 font-semibold">{transaction.type}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-800">Metadata Breakdown</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-450 text-xs block font-semibold">Reference / Txn Hash</span>
                  <span className="text-slate-700 font-mono text-xs break-all font-medium">
                    {transaction.transactionId || transaction._id}
                  </span>
                </div>

                <div>
                  <span className="text-slate-455 text-xs block font-semibold">Payment Method</span>
                  <span className="text-slate-850 font-semibold">
                    {transaction.paymentMethod || "Internal Balance"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-455 text-xs block font-semibold">Description</span>
                  <span className="text-slate-700 font-medium">
                    {transaction.description || "N/A"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-455 text-xs block font-semibold">Date & Time</span>
                  <span className="text-slate-750 flex items-center gap-1.5 text-xs font-medium">
                    <FaRegClock size={12} className="text-slate-400" />
                    {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;