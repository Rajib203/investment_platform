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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            ROI History
          </h1>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Investment</th>
                  <th className="px-4 py-3 text-left">ROI %</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8"
                    >
                      No ROI History Found
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t"
                    >
                      <td className="px-4 py-3">
                        {item.investment?.planName}
                      </td>

                      <td className="px-4 py-3">
                        ₹{item.investment?.amount}
                      </td>

                      <td className="px-4 py-3">
                        {item.percentage}%
                      </td>

                      <td className="px-4 py-3 font-semibold text-green-600">
                        ₹{item.amount}
                      </td>

                      <td className="px-4 py-3">
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
  );
};

export default ROIHistory;