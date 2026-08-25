import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import {
  getAllDeposits,
  approveDeposit,
  rejectDeposit,
} from "../../services/deposit.service"; // Adjust path to your service file

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal states
  const [selectedDeposit, setSelectedDeposit] = useState(null); // For View Details
  const [rejectingId, setRejectingId] = useState(null); // ID for Rejection modal
  const [rejectRemark, setRejectRemark] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await getAllDeposits();
      setDeposits(res.data.data || res.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load deposit requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this deposit?")) return;

    try {
      setActionLoading(true);
      const res = await approveDeposit(id);
      toast.success(res.data.message || "Deposit approved successfully");
      fetchDeposits();
      if (selectedDeposit?._id === id) setSelectedDeposit(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingId) return;

    try {
      setActionLoading(true);
      const res = await rejectDeposit(rejectingId, rejectRemark);
      toast.success(res.data.message || "Deposit request rejected");
      setRejectingId(null);
      setRejectRemark("");
      fetchDeposits();
      if (selectedDeposit?._id === rejectingId) setSelectedDeposit(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  // --- FILTERING LOGIC ---

  const filteredDeposits = deposits.filter((item) => {
    // Status Filter
    const matchesStatus =
      statusFilter === "ALL" ||
      item.status?.toUpperCase() === statusFilter.toUpperCase();

    // Search Query (Transaction ID, Amount, Payment Method, or User info)
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.transactionId?.toLowerCase().includes(query) ||
      item.amount?.toString().includes(query) ||
      item.paymentMethod?.toLowerCase().includes(query) ||
      item.userId?.name?.toLowerCase().includes(query) ||
      item.userId?.email?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              All Deposit Requests
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage and review incoming deposit submissions from users.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-slate-800">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search Txn ID, User, Amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="text-slate-400 shrink-0" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Deposits Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center p-8 text-slate-500">
                        Loading requests...
                      </td>
                    </tr>
                  ) : filteredDeposits.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-8 text-slate-450">
                        No deposit requests match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDeposits.map((deposit) => (
                      <tr
                        key={deposit._id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* User Info */}
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">
                            {deposit.userId?.name || "N/A"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {deposit.userId?.email || deposit.userId || "-"}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-4 font-bold text-emerald-600">
                          ₹{deposit.amount}
                        </td>

                        {/* Payment Method */}
                        <td className="p-4 font-semibold uppercase text-xs tracking-wider">
                          <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
                            {deposit.paymentMethod}
                          </span>
                        </td>

                        {/* Transaction ID */}
                        <td className="p-4 font-mono text-xs text-slate-500">
                          {deposit.transactionId}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              deposit.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : deposit.status === "Rejected"
                                ? "bg-rose-100 text-rose-800 border-rose-200"
                                : "bg-amber-100 text-amber-850 border-amber-200"
                            }`}
                          >
                            {deposit.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-4 text-xs text-slate-500">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Details */}
                            <button
                              onClick={() => setSelectedDeposit(deposit)}
                              title="View Details"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Approve Button (Only if Pending) */}
                            {deposit.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(deposit._id)}
                                  disabled={actionLoading}
                                  title="Approve Request"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-750 border border-emerald-200 transition-colors"
                                >
                                  <Check size={16} />
                                </button>

                                <button
                                  onClick={() => setRejectingId(deposit._id)}
                                  disabled={actionLoading}
                                  title="Reject Request"
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-750 border border-rose-200 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* =========================================================================
              MODAL 1: VIEW DETAILS & SCREENSHOT
             ========================================================================= */}
          {selectedDeposit && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8 text-slate-800">
                <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">
                    Deposit Details
                  </h3>
                  <button
                    onClick={() => setSelectedDeposit(null)}
                    className="text-slate-400 hover:text-slate-650 p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">Amount</span>
                      <span className="text-emerald-600 font-bold text-lg">
                        ₹{selectedDeposit.amount}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">Status</span>
                      <span className="font-semibold text-slate-800">
                        {selectedDeposit.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">
                        Payment Method
                      </span>
                      <span className="text-slate-800 font-mono font-medium">
                        {selectedDeposit.paymentMethod}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">
                        Transaction ID
                      </span>
                      <span className="text-slate-800 font-mono text-xs break-all font-medium">
                        {selectedDeposit.transactionId}
                      </span>
                    </div>
                  </div>

                  {/* Payment Screenshot */}
                  <div>
                    <span className="text-slate-700 text-sm font-semibold block mb-2">
                      Payment Proof Screenshot
                    </span>
                    {selectedDeposit.paymentScreenshot ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-2 text-center">
                        <img
                          src={selectedDeposit.paymentScreenshot}
                          alt="Payment Proof"
                          className="max-h-80 mx-auto rounded object-contain"
                        />
                        <a
                          href={selectedDeposit.paymentScreenshot}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-650 hover:underline mt-2 font-medium"
                        >
                          Open Full Image <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm italic">
                        No screenshot provided.
                      </p>
                    )}
                  </div>

                  {/* Action Bar inside Modal */}
                  {selectedDeposit.status === "Pending" && (
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => handleApprove(selectedDeposit._id)}
                        disabled={actionLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                      >
                        Approve Request
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(selectedDeposit._id);
                        }}
                        disabled={actionLoading}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                      >
                        Reject Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL 2: REJECTION REMARK INPUT
             ========================================================================= */}
          {rejectingId && (
            <div className="fixed inset-0 z-55 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 shadow-2xl text-slate-800">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Reject Deposit Request
                </h3>
                <p className="text-slate-500 text-xs mb-4">
                  Provide a reason/remark so the user knows why their deposit was declined.
                </p>

                <form onSubmit={handleRejectSubmit} className="space-y-4">
                  <textarea
                    value={rejectRemark}
                    onChange={(e) => setRejectRemark(e.target.value)}
                    placeholder="Reason for rejection (e.g., Invalid Transaction ID)"
                    required
                    rows={3}
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-250 transition-colors resize-none"
                  />

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setRejectingId(null);
                        setRejectRemark("");
                      }}
                      className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm"
                    >
                      {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDeposits;