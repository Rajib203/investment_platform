import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import UserSidebar from "../../components/layout/Sidebar";
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
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* 1. Single Sidebar */}
      <UserSidebar />

      {/* 2. Main Content Container */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">
          Deposit History
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 font-medium uppercase tracking-wider border-b border-slate-800">
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

              <tbody className="divide-y divide-slate-800 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-slate-400">
                      Loading deposits...
                    </td>
                  </tr>
                ) : deposits.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-slate-500">
                      No Deposit Requests Found
                    </td>
                  </tr>
                ) : (
                  deposits.map((deposit) => (
                    <tr
                      key={deposit._id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 font-semibold text-white">
                        ₹{deposit.amount}
                      </td>

                      <td className="p-4 capitalize">
                        {deposit.paymentMethod}
                      </td>

                      <td className="p-4 font-mono text-xs text-slate-400">
                        {deposit.transactionId}
                      </td>

                      <td className="p-4">
                        {deposit.paymentScreenshot ? (
                          <a
                            href={deposit.paymentScreenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-slate-600">N/A</span>
                        )}
                      </td>

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

                      <td className="p-4 text-slate-400">
                        {deposit.remark || "-"}
                      </td>

                      <td className="p-4 text-slate-400">
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
  );
};

export default DepositHistory;