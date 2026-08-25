import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { getROIHistory } from "../../services/roi.service";

const ROIHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchROIHistory();
  }, []);

  const fetchROIHistory = async () => {
    try {
      const res = await getROIHistory();
      setHistory(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ROI history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">
            ROI History
          </h1>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Investment</th>
                    <th className="px-4 py-3">ROI %</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-8 text-slate-500 font-medium"
                      >
                        Loading ROI history...
                      </td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-8 text-slate-450 font-medium"
                      >
                        No ROI History Found
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {item.investment?.planName || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          ₹{item.investment?.amount || "0"}
                        </td>

                        <td className="px-4 py-3 text-slate-650 font-medium">
                          {item.percentage}%
                        </td>

                        <td className="px-4 py-3 font-bold text-emerald-600">
                          +₹{item.amount}
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
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

export default ROIHistory;