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
              <p className="text-gray-500">Wallet Balance</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                ₹{wallet.walletBalance}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Total Deposit</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                ₹{wallet.totalDeposit}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Total Investment</p>
              <h2 className="text-3xl font-bold text-purple-600 mt-2">
                ₹{wallet.totalInvestment}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">ROI Earned</p>
              <h2 className="text-3xl font-bold text-green-500 mt-2">
                ₹{wallet.totalROI}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Referral Income</p>
              <h2 className="text-3xl font-bold text-orange-500 mt-2">
                ₹{wallet.totalReferral}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Withdrawals</p>
              <h2 className="text-3xl font-bold text-red-500 mt-2">
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

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>

                  {wallet.recentTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-5 text-gray-500"
                      >
                        No Transactions Found
                      </td>
                    </tr>
                  ) : (
                    wallet.recentTransactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{tx.type}</td>

                        <td className="p-3 font-semibold">
                          ₹{tx.amount}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-white ${
                              tx.status === "SUCCESS"
                                ? "bg-green-600"
                                : tx.status === "FAILED"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>

                        <td className="p-3">
                          {tx.description}
                        </td>

                        <td className="p-3">
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