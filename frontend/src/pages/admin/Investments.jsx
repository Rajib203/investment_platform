import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";

import { getAllInvestments } from "../../services/adminInvestment.service";

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      const res = await getAllInvestments();
      setInvestments(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch investments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="text-2xl font-bold mb-5">
              All Investments
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">

                <table className="min-w-full border">

                  <thead className="bg-gray-200">

                    <tr>
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Plan</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">ROI</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Created</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {investments.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-5"
                        >
                          No Investments Found
                        </td>
                      </tr>
                    ) : (
                      investments.map((item) => (
                        <tr
                          key={item._id}
                          className="border-t"
                        >
                          <td className="p-3">
                            {item.user?.fullName}
                          </td>

                          <td className="p-3">
                            {item.planName}
                          </td>

                          <td className="p-3">
                            ₹{item.amount}
                          </td>

                          <td className="p-3">
                            {item.dailyROIPercentage}%
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded text-white text-sm
                              ${
                                item.status === "Active"
                                  ? "bg-green-600"
                                  : item.status === "Completed"
                                  ? "bg-blue-600"
                                  : "bg-red-600"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td className="p-3">
                            {new Date(
                              item.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="p-3 text-center">

                            <Link
                              to={`/admin/investments/${item._id}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              View
                            </Link>

                          </td>
                        </tr>
                      ))
                    )}

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

export default Investments;