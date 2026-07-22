import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { getReferralIncomeHistory } from "../../services/referral.service";

const ReferralIncome = () => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await getReferralIncomeHistory();
      setIncome(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load referral income");
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
            Referral Income History
          </h1>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">From User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Level</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : income.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      No Referral Income Found
                    </td>
                  </tr>
                ) : (
                  income.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-3">
                        {item.generatedBy?.fullName}
                      </td>

                      <td className="px-4 py-3">
                        {item.generatedBy?.email}
                      </td>

                      <td className="px-4 py-3">
                        Level {item.level}
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

export default ReferralIncome;