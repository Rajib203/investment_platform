import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getMyDeposits } from "../../services/deposit.service";

const DepositHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await getMyDeposits();
      setDeposits(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load deposits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 tracking-tight text-slate-900">
            Deposit History
          </h1>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-850 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Screenshot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Remark</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center p-8 text-slate-650 font-medium animate-pulse">
                        Loading deposits...
                      </td>
                    </tr>
                  ) : deposits.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-8 text-slate-600 font-medium">
                        No Deposit Requests Found
                      </td>
                    </tr>
                  ) : (
                    deposits.map((deposit) => (
                      <tr
                        key={deposit._id}
                        className="hover:bg-gray-50/50 transition-colors border-b border-slate-100"
                      >
                        <td className="p-4 font-semibold text-slate-900">
                          ₹{deposit.amount}
                        </td>

                        <td className="p-4 capitalize text-slate-800 font-medium">
                          {deposit.paymentMethod}
                        </td>

                        <td className="p-4 font-mono text-xs text-slate-600 font-semibold">
                          {deposit.transactionId}
                        </td>

                        <td className="p-4">
                          {deposit.paymentScreenshot ? (
                            <a
                              href={deposit.paymentScreenshot}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              deposit.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : deposit.status === "Rejected"
                                ? "bg-rose-100 text-rose-800 border-rose-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {deposit.status}
                          </span>
                        </td>

                        <td className="p-4 text-slate-600">
                          {deposit.remark || "-"}
                        </td>

                        <td className="p-4 text-xs text-slate-600 font-medium">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DepositHistory;