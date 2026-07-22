import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaExchangeAlt,
  FaEye,
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaGift,
} from "react-icons/fa";
import { getAllTransactions } from "../../services/adminTransaction.service";
const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    fetchTransactions();
  }, []);

 const fetchTransactions = async () => {
  try {
    setLoading(true);
    const res = await getAllTransactions(); // Updated function name
    setTransactions(res.data?.data || res.data || []);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to load transactions"
    );
  } finally {
    setLoading(false);
  }
};

  // Filter logic
  const filteredTransactions = transactions.filter((item) => {
    const matchesType =
      typeFilter === "ALL" ||
      item.type?.toUpperCase() === typeFilter.toUpperCase();

    const query = searchQuery.toLowerCase();
    const userName = item.userId?.name?.toLowerCase() || "";
    const userEmail = item.userId?.email?.toLowerCase() || "";
    const txnId = item.transactionId?.toLowerCase() || item._id?.toLowerCase() || "";
    const amountStr = item.amount?.toString() || "";

    const matchesSearch =
      userName.includes(query) ||
      userEmail.includes(query) ||
      txnId.includes(query) ||
      amountStr.includes(query);

    return matchesType && matchesSearch;
  });

  const getTypeBadge = (type) => {
    switch (type?.toUpperCase()) {
      case "DEPOSIT":
        return (
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <FaArrowDown size={11} /> Deposit
          </span>
        );
      case "WITHDRAWAL":
        return (
          <span className="flex items-center gap-1 text-rose-400 font-medium">
            <FaArrowUp size={11} /> Withdrawal
          </span>
        );
      case "INVESTMENT":
        return (
          <span className="flex items-center gap-1 text-blue-400 font-medium">
            <FaChartLine size={11} /> Investment
          </span>
        );
      case "BONUS":
      case "REFERRAL":
        return (
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <FaGift size={11} /> Bonus
          </span>
        );
      default:
        return <span className="text-slate-300">{type}</span>;
    }
  };

  return (
    <div className="p-6 text-white space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <FaExchangeAlt className="text-indigo-500" size={22} /> Admin Transactions
        </h1>
        <p className="text-slate-400 text-sm">
          Monitor and manage all user transactions across the platform.
        </p>
      </div>

      {/* Controls: Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search by user, Txn ID, amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-slate-500" size={14} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="ALL">All Types</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="WITHDRAWAL">Withdrawals</option>
            <option value="INVESTMENT">Investments</option>
            <option value="BONUS">Bonuses</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/60 text-slate-400 font-medium uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-white">
                        {item.userId?.name || "N/A"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.userId?.email || ""}
                      </div>
                    </td>
                    <td className="p-4">{getTypeBadge(item.type)}</td>
                    <td className="p-4 font-semibold text-emerald-400">
                      ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.status === "Completed" ||
                          item.status === "Approved" ||
                          item.status === "Success"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : item.status === "Failed" ||
                              item.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {item.status || "Completed"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/transactions/${item._id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg text-xs font-medium transition-colors border border-indigo-500/30"
                      >
                        <FaEye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;