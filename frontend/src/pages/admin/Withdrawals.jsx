import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../../services/adminWithdraw.service";

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track specific item ID being updated

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await getAllWithdrawals();
      // Supports array responses or wrapped res.data.data
      const data = res?.data?.data || res?.data || [];
      setWithdrawals(data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this withdrawal request?")) return;

    try {
      setActionLoading(id);
      await approveWithdrawal(id);
      toast.success("Withdrawal approved successfully!");
      fetchWithdrawals();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to approve withdrawal");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const remark = prompt("Enter rejection reason / remark:");
    if (!remark) return;

    try {
      setActionLoading(id);
      await rejectWithdrawal(id, remark);
      toast.success("Withdrawal rejected and user refunded.");
      fetchWithdrawals();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reject withdrawal");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Withdrawal Requests
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      Loading withdrawals...
                    </td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-6 text-gray-500"
                    >
                      No withdrawal requests found.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((item) => {
                    const statusUpper = item.status?.toUpperCase();
                    const isPending =
                      statusUpper === "PENDING";
                    const isApproved =
                      statusUpper === "APPROVED" || statusUpper === "SUCCESS";
                    const isRejected =
                      statusUpper === "REJECTED" || statusUpper === "FAILED";

                    return (
                      <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                        {/* User Info */}
                        <td className="p-3">
                          <div className="font-semibold text-gray-800">
                            {item.user?.name || item.user?.fullName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.user?.email || "N/A"}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-3 font-medium text-gray-900">
                          ₹{item.amount}
                        </td>

                        {/* Status Badge */}
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                              isApproved
                                ? "bg-green-600"
                                : isRejected
                                ? "bg-red-600"
                                : "bg-yellow-500"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-3 text-sm text-gray-600">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/admin/withdrawals/${item._id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                            >
                              View
                            </Link>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApprove(item._id)}
                                  disabled={actionLoading === item._id}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(item._id)}
                                  disabled={actionLoading === item._id}
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;