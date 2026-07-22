import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";

import {
  getInvestmentById,
  completeInvestment,
  cancelInvestment,
} from "../../services/adminInvestment.service";

const InvestmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInvestment = async () => {
    try {
      const res = await getInvestmentById(id);
      setInvestment(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load investment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestment();
  }, []);

  const handleComplete = async () => {
    if (!window.confirm("Complete this investment?")) return;

    try {
      await completeInvestment(id);
      toast.success("Investment completed");
      fetchInvestment();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this investment?")) return;

    try {
      await cancelInvestment(id);
      toast.success("Investment cancelled");
      fetchInvestment();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6">Loading...</div>
        </div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6">Investment not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 px-4 py-2 bg-gray-700 text-white rounded"
          >
            Back
          </button>

          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-2xl font-bold">Investment Details</h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <p className="text-gray-500">User</p>
                <p className="font-semibold">
                  {investment.user?.fullName}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p>{investment.user?.email}</p>
              </div>

              <div>
                <p className="text-gray-500">Amount</p>
                <p>₹{investment.amount}</p>
              </div>

              <div>
                <p className="text-gray-500">Plan</p>
                <p>{investment.planName}</p>
              </div>

              <div>
                <p className="text-gray-500">Daily ROI</p>
                <p>{investment.dailyROIPercentage}%</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded text-white ${
                    investment.status === "Active"
                      ? "bg-green-600"
                      : investment.status === "Completed"
                      ? "bg-blue-600"
                      : "bg-red-600"
                  }`}
                >
                  {investment.status}
                </span>
              </div>

              <div>
                <p className="text-gray-500">Start Date</p>
                <p>
                  {new Date(investment.startDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-gray-500">End Date</p>
                <p>
                  {new Date(investment.endDate).toLocaleDateString()}
                </p>
              </div>

            </div>

            {investment.status === "Active" && (
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleComplete}
                  className="bg-green-600 text-white px-5 py-2 rounded"
                >
                  Complete
                </button>

                <button
                  onClick={handleCancel}
                  className="bg-red-600 text-white px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails;