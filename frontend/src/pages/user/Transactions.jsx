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
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <FaArrowDown size={12} /> Deposit
          </span>
        );
      case "WITHDRAWAL":
        return (
          <span className="flex items-center gap-1.5 text-rose-400 font-medium">
            <FaArrowUp size={12} /> Withdrawal
          </span>
        );
      case "INVESTMENT":
        return (
          <span className="flex items-center gap-1.5 text-blue-400 font-medium">
            <FaChartLine size={12} /> Investment
          </span>
        );
      case "BONUS":
      case "REFERRAL":
        return (
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <FaGift size={12} /> Bonus
          </span>
        );
      default:
        return <span className="text-slate-300">{type}</span>;
    }
  };

  return (
    <div className="p-6 text-white space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <FaExchangeAlt className="text-indigo-500" size={22} /> Transactions
        </h1>
        <p className="text-slate-400 text-sm">
          Your complete transaction history across deposits, withdrawals, and investments.
        </p>
      </div>

      {/* Controls: Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search Txn ID, description..."
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
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Txn ID / Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-slate-500">
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
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4">{getTypeBadge(item.type)}</td>
                      <td
                        className={`p-4 font-semibold ${
                          isDebit ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {isDebit ? "-" : "+"}₹{item.amount}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-300 font-mono text-xs">
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
  );
};

export default Transactions;