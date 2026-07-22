import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import toast from "react-hot-toast";
import {
  getWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
} from "../../services/adminWithdraw.service";

const WithdrawalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getWithdrawalById(id);
      // Handles both direct object or res.data wrappers
      setWithdrawal(res?.data?.data || res?.data || res);
    } catch (error) {
      console.error("Error loading withdrawal details:", error);
      toast.error("Failed to fetch withdrawal details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this withdrawal?")) return;

    try {
      setActionLoading(true);
      await approveWithdrawal(id);
      toast.success("Withdrawal approved successfully!");
      fetchDetails();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to approve withdrawal.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!remark.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    try {
      setActionLoading(true);
      await rejectWithdrawal(id, remark);
      toast.success("Withdrawal rejected and funds refunded to user.");
      fetchDetails();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reject withdrawal.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-8 text-center text-gray-500">
            Loading withdrawal details...
          </div>
        </div>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-8 text-center text-red-500">
            Withdrawal request not found.
          </div>
        </div>
      </div>
    );
  }

  const isPending =
    withdrawal.status?.toUpperCase() === "PENDING";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/admin/withdrawals")}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              &larr; Back to Withdrawals
            </button>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                withdrawal.status === "Approved" || withdrawal.status === "SUCCESS"
                  ? "bg-green-600"
                  : withdrawal.status === "Rejected" || withdrawal.status === "FAILED"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }`}
            >
              {withdrawal.status}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">
              Withdrawal Request Details
            </h1>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">
                  User Name
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {withdrawal.user?.name || withdrawal.user?.fullName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">
                  User Email
                </p>
                <p className="text-base font-medium text-gray-700">
                  {withdrawal.user?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">
                  Amount Requested
                </p>
                <p className="text-xl font-bold text-green-600">
                  ₹{withdrawal.amount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">
                  Requested Date
                </p>
                <p className="text-base text-gray-700">
                  {withdrawal.createdAt
                    ? new Date(withdrawal.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Account / Payment Method Details */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Payment / Bank Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Method: </span>
                  <span className="font-semibold text-gray-800">
                    {withdrawal.paymentMethod || withdrawal.method || "Bank Transfer"}
                  </span>
                </div>
                {withdrawal.accountNumber && (
                  <div>
                    <span className="text-gray-500">Account Number: </span>
                    <span className="font-mono font-medium text-gray-800">
                      {withdrawal.accountNumber}
                    </span>
                  </div>
                )}
                {withdrawal.ifscCode && (
                  <div>
                    <span className="text-gray-500">IFSC Code: </span>
                    <span className="font-mono font-medium text-gray-800">
                      {withdrawal.ifscCode}
                    </span>
                  </div>
                )}
                {withdrawal.bankName && (
                  <div>
                    <span className="text-gray-500">Bank Name: </span>
                    <span className="font-medium text-gray-800">
                      {withdrawal.bankName}
                    </span>
                  </div>
                )}
                {withdrawal.upiId && (
                  <div>
                    <span className="text-gray-500">UPI ID: </span>
                    <span className="font-mono font-medium text-gray-800">
                      {withdrawal.upiId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Existing Remarks if available */}
            {withdrawal.remark && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 font-medium uppercase mb-1">
                  Admin Remark
                </p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {withdrawal.remark}
                </div>
              </div>
            )}

            {/* Action Panel for Pending Requests */}
            {isPending && (
              <div className="border-t pt-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Process Withdrawal Request
                </h2>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Rejection Remark (Required only if rejecting)
                  </label>
                  <textarea
                    rows={2}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetails;