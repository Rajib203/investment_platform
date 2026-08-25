import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";

import Navbar from "../../components/layout/Navbar"; // Keep if you use a Navbar component


import { getWalletSummary } from "../../services/wallet.service";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await getWalletSummary();
      setWallet(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load wallet."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6 text-xl">Loading Wallet...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              My Wallet
            </h1>

            <Link
              to="/wallet/history"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Wallet History
            </Link>
          </div>

          {/* Summary Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Wallet Balance</p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                ₹{wallet.walletBalance}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Total Deposit</p>
              <h2 className="text-3xl font-bold text-blue-700 mt-2">
                ₹{wallet.totalDeposit}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Total Investment</p>
              <h2 className="text-3xl font-bold text-indigo-750 mt-2">
                ₹{wallet.totalInvestment}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">ROI Earned</p>
              <h2 className="text-3xl font-bold text-emerald-700 mt-2">
                ₹{wallet.totalROI}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Referral Income</p>
              <h2 className="text-3xl font-bold text-amber-700 mt-2">
                ₹{wallet.totalReferral}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">Withdrawals</p>
              <h2 className="text-3xl font-bold text-rose-700 mt-2">
                ₹{wallet.totalWithdrawal}
              </h2>
            </div>

          </div>

          {/* Recent Transactions */}

          <div className="bg-white rounded-xl shadow mt-8 p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Recent Transactions
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-100 text-slate-850 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>

                <tbody className="text-slate-700">

                  {wallet.recentTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-5 text-slate-600 font-medium"
                      >
                        No Transactions Found
                      </td>
                    </tr>
                  ) : (
                    wallet.recentTransactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="border-b border-slate-100 hover:bg-gray-50/50"
                      >
                        <td className="p-3 font-medium text-slate-900">{tx.type}</td>

                        <td className="p-3 font-semibold text-slate-800">
                          ₹{tx.amount}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tx.status === "SUCCESS" || tx.status === "Success" || tx.status === "Approved" || tx.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : tx.status === "FAILED" || tx.status === "Failed" || tx.status === "Rejected"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-850"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>

                        <td className="p-3 text-slate-700">
                          {tx.description}
                        </td>

                        <td className="p-3 text-xs text-slate-600 font-medium">
                          {new Date(tx.createdAt).toLocaleDateString()}
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
    </div>
  );
};

export default Wallet;