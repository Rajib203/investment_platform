import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          All Deposit Requests
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage and review incoming deposit submissions from users.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search Txn ID, User, Amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="text-slate-500 shrink-0" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Deposits Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/60 text-slate-400 font-medium uppercase tracking-wider border-b border-slate-800">
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

            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-slate-400">
                    Loading requests...
                  </td>
                </tr>
              ) : filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-slate-500">
                    No deposit requests match your criteria.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((deposit) => (
                  <tr
                    key={deposit._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* User Info */}
                    <td className="p-4">
                      <div className="font-medium text-white">
                        {deposit.userId?.name || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {deposit.userId?.email || deposit.userId || "-"}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-semibold text-emerald-400">
                      ₹{deposit.amount}
                    </td>

                    {/* Payment Method */}
                    <td className="p-4 font-medium uppercase text-xs tracking-wider">
                      <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        {deposit.paymentMethod}
                      </span>
                    </td>

                    {/* Transaction ID */}
                    <td className="p-4 font-mono text-xs text-slate-400">
                      {deposit.transactionId}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          deposit.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : deposit.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedDeposit(deposit)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              onClick={() => setRejectingId(deposit._id)}
                              disabled={actionLoading}
                              title="Reject Request"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Deposit Details
              </h3>
              <button
                onClick={() => setSelectedDeposit(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-xs block">Amount</span>
                  <span className="text-emerald-400 font-bold text-lg">
                    ₹{selectedDeposit.amount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Status</span>
                  <span className="font-semibold text-white">
                    {selectedDeposit.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">
                    Payment Method
                  </span>
                  <span className="text-white font-mono">
                    {selectedDeposit.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">
                    Transaction ID
                  </span>
                  <span className="text-white font-mono text-xs break-all">
                    {selectedDeposit.transactionId}
                  </span>
                </div>
              </div>

              {/* Payment Screenshot */}
              <div>
                <span className="text-slate-400 text-sm font-medium block mb-2">
                  Payment Proof Screenshot
                </span>
                {selectedDeposit.paymentScreenshot ? (
                  <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950 p-2 text-center">
                    <img
                      src={selectedDeposit.paymentScreenshot}
                      alt="Payment Proof"
                      className="max-h-80 mx-auto rounded object-contain"
                    />
                    <a
                      href={selectedDeposit.paymentScreenshot}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline mt-2"
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
                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleApprove(selectedDeposit._id)}
                    disabled={actionLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-semibold transition"
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      setRejectingId(selectedDeposit._id);
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-lg text-sm font-semibold transition"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Reject Deposit Request
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Provide a reason/remark so the user knows why their deposit was declined.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
                placeholder="Reason for rejection (e.g., Invalid Transaction ID)"
                required
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingId(null);
                    setRejectRemark("");
                  }}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition"
                >
                  {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeposits;