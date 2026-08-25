import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { getWalletHistory } from "../../services/wallet.service";

const WalletHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let data = [...transactions];

    if (typeFilter !== "ALL") {
      data = data.filter((item) => item.type === typeFilter);
    }

    if (search) {
      data = data.filter(
        (item) =>
          item.description
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.type
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredTransactions(data);
  }, [transactions, search, typeFilter]);

  const fetchHistory = async () => {
    try {
      const res = await getWalletHistory();

      setTransactions(res.data.data);
      setFilteredTransactions(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load wallet history"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          <h1 className="text-3xl font-bold mb-6">
            Wallet History
          </h1>

          {/* Filters */}

          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <input
              type="text"
              placeholder="Search transaction..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg px-4 py-2 w-full md:w-80"
            />

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="border rounded-lg px-4 py-2"
            >
              <option value="ALL">All</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="INVESTMENT">Investment</option>
              <option value="ROI">ROI</option>
              <option value="REFERRAL_INCOME">
                Referral Income
              </option>
              <option value="WITHDRAWAL">
                Withdrawal
              </option>
            </select>

          </div>

          {/* Table */}

          <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">

            <table className="w-full">

              <thead className="bg-slate-100 text-slate-850 font-bold border-b border-slate-200">

                <tr>
                  <th className="p-3.5 text-left">Type</th>
                  <th className="p-3.5 text-left">Amount</th>
                  <th className="p-3.5 text-left">Status</th>
                  <th className="p-3.5 text-left">Description</th>
                  <th className="p-3.5 text-left">Date</th>
                </tr>

              </thead>

              <tbody className="text-slate-700">

                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-8 text-slate-650 font-medium animate-pulse"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-8 text-slate-600 font-medium"
                    >
                      No Transactions Found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-gray-50/50"
                    >
                      <td className="p-3 font-semibold text-slate-900">
                        {item.type}
                      </td>

                      <td className="p-3 font-semibold text-slate-800">
                        ₹{item.amount}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "SUCCESS" || item.status === "Success" || item.status === "Approved" || item.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "FAILED" || item.status === "Failed" || item.status === "Rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-850"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3 text-slate-700">
                        {item.description}
                      </td>

                      <td className="p-3 text-xs text-slate-600 font-medium">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
};

export default WalletHistory;