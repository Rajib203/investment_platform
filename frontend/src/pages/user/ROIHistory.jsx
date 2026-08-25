import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { getROIHistory, runROI } from "../../services/roi.service";
import { getInvestments } from "../../services/investment.service";

const ROIHistory = () => {
  const [history, setHistory] = useState([]);
  const [hasActiveInvestments, setHasActiveInvestments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [triggeringROI, setTriggeringROI] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roiRes, invRes] = await Promise.all([
        getROIHistory(),
        getInvestments(),
      ]);
      setHistory(roiRes.data.data || []);
      const activeInvs = (invRes.data.data || []).some(
        (inv) => inv.status === "Active"
      );
      setHasActiveInvestments(activeInvs);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ROI data");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerROI = async () => {
    try {
      setTriggeringROI(true);
      const res = await runROI();
      toast.success(res.data.message || "ROI processed successfully!");
      // Reload history and check active investments again
      const roiRes = await getROIHistory();
      setHistory(roiRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to trigger ROI");
    } finally {
      setTriggeringROI(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-slate-900">
              ROI History
            </h1>

            {hasActiveInvestments && history.length > 0 && (
              <button
                onClick={handleTriggerROI}
                disabled={triggeringROI}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                {triggeringROI ? "Processing ROI..." : "Trigger Daily ROI (Demo)"}
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Plan</th>
                    <th className="px-4 py-3.5">Investment</th>
                    <th className="px-4 py-3.5">ROI %</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-slate-650 font-medium animate-pulse"
                      >
                        Loading ROI history...
                      </td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 px-6">
                        <div className="max-w-md mx-auto my-4 text-slate-800">
                          <p className="font-bold text-lg mb-2 text-slate-900">
                            No ROI History Found
                          </p>
                          {hasActiveInvestments ? (
                            <div className="space-y-4">
                              <p className="text-sm text-slate-600 leading-relaxed">
                                Daily ROI is automatically processed and credited at midnight (12:00 AM). 
                                Since you have active investments, you can manually trigger ROI distribution below to test or view it immediately.
                              </p>
                              <button
                                onClick={handleTriggerROI}
                                disabled={triggeringROI}
                                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm disabled:bg-blue-400 cursor-pointer"
                              >
                                {triggeringROI ? "Processing ROI..." : "Trigger Daily ROI (Demo/Test Mode)"}
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <p className="text-sm text-slate-600 leading-relaxed">
                                You do not have any active investments currently. Daily Return on Investment (ROI) requires an active plan.
                              </p>
                              <Link
                                to="/investments"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                              >
                                Purchase Investment Plan
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {item.investment?.planName || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          ₹{item.investment?.amount || "0"}
                        </td>

                        <td className="px-4 py-3 text-slate-800 font-semibold">
                          {item.percentage}%
                        </td>

                        <td className="px-4 py-3 font-bold text-emerald-700">
                          +₹{item.amount}
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600 font-medium">
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