import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { getDirectReferrals } from "../../services/referral.service";

const DirectReferrals = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await getDirectReferrals();
      setReferrals(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load referrals");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            Direct Referrals
          </h1>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Referral Code</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>

              <tbody>
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8">
                      No Referrals Found
                    </td>
                  </tr>
                ) : (
                  referrals.map((user) => (
                    <tr key={user._id} className="border-t">
                      <td className="px-4 py-3">
                        {user.fullName}
                      </td>

                      <td className="px-4 py-3">
                        {user.email}
                      </td>

                      <td className="px-4 py-3">
                        {user.referralCode}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
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

export default DirectReferrals;