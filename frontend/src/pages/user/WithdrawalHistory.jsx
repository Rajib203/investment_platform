import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getMyWithdrawals } from "../../services/withdrawal.service";

const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWithdrawals = async () => {
    try {
      const { data } = await getMyWithdrawals();
      setWithdrawals(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load withdrawals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
              Withdrawal History
            </h2>

            {loading ? (
              <div className="text-center py-10 text-slate-600 font-medium">
                Loading...
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-10 text-slate-650 font-medium">
                No withdrawal requests found.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">

                <table className="w-full border-collapse">

                  <thead className="bg-slate-100 text-slate-850 font-bold border-b border-slate-200">

                    <tr>
                      <th className="p-3 text-left">
                        Amount
                      </th>

                      <th className="p-3 text-left">
                        Method
                      </th>

                      <th className="p-3 text-left">
                        Status
                      </th>

                      <th className="p-3 text-left">
                        Date
                      </th>

                      <th className="p-3 text-left">
                        Remark
                      </th>
                    </tr>

                  </thead>

                  <tbody className="text-slate-700">

                    {withdrawals.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-slate-100 hover:bg-gray-50/50"
                      >
                        <td className="p-3 font-semibold text-slate-850">
                          ₹{item.amount}
                        </td>

                        <td className="p-3 text-slate-700">
                          {item.paymentMethod}
                        </td>

                        <td className="p-3">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === "Approved" || item.status === "SUCCESS" || item.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "Rejected" || item.status === "FAILED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-850"
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                        <td className="p-3 text-xs text-slate-600 font-medium">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-3 text-slate-650 text-xs">
                          {item.remark || "-"}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHistory;