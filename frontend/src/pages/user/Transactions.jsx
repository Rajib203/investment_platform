import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaExchangeAlt,
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaGift,
} from "react-icons/fa";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getTransactions } from "../../services/transaction.service"; // Adjust import path

const Transactions = () => {
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
      const res = await getTransactions();
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
    const matchesSearch =
      item.transactionId?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.amount?.toString().includes(query);

    return matchesType && matchesSearch;
  });

  const getTypeBadge = (type) => {
    switch (type?.toUpperCase()) {
      case "DEPOSIT":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold">
            <FaArrowDown size={10} /> Deposit
          </span>
        );
      case "WITHDRAWAL":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-md text-xs font-semibold">
            <FaArrowUp size={10} /> Withdrawal
          </span>
        );
      case "INVESTMENT":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">
            <FaChartLine size={10} /> Investment
          </span>
        );
      case "BONUS":
      case "REFERRAL":
      case "REFERRAL_INCOME":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-md text-xs font-semibold">
            <FaGift size={10} /> Bonus
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2 text-slate-900">
              <FaExchangeAlt className="text-indigo-600" size={24} /> Transactions
            </h1>
            <p className="text-slate-500 text-sm">
              Your complete transaction history across deposits, withdrawals, and investments.
            </p>
          </div>

          {/* Controls: Search and Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-slate-850">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search Txn ID, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FaFilter className="text-slate-400 shrink-0" size={14} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-44 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
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
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 text-slate-650 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Txn ID / Details</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-slate-500">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-slate-450">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((item) => {
                      const isDebit =
                        item.type?.toUpperCase() === "WITHDRAWAL" ||
                        item.type?.toUpperCase() === "INVESTMENT";

                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-slate-55/30 transition-colors"
                        >
                          <td className="p-4">{getTypeBadge(item.type)}</td>
                          <td
                            className={`p-4 font-semibold ${
                              isDebit ? "text-rose-600" : "text-emerald-600"
                            }`}
                          >
                            {isDebit ? "-" : "+"}₹{item.amount}
                          </td>
                          <td className="p-4">
                            <div className="text-slate-800 font-mono text-xs font-medium">
                              {item.transactionId || item._id}
                            </div>
                            {item.description && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                item.status === "Completed" ||
                                item.status === "Approved" ||
                                item.status === "Success"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : item.status === "Failed" ||
                                    item.status === "Rejected"
                                  ? "bg-rose-100 text-rose-800 border-rose-200"
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                            >
                              {item.status || "Completed"}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {new Date(item.createdAt).toLocaleDateString()}
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
    </div>
  );
};

export default Transactions;