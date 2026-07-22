import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import StatCard from "../../components/admin/StatCard";
import { getAdminDashboard } from "../../services/admin.service";

import {
  FaUsers,
  FaWallet,
  FaChartLine,
  FaMoneyBillWave,
  FaCoins,
  FaUserCheck,
} from "react-icons/fa";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalInvestments: 0,
    totalInvestmentAmount: 0,
    totalWithdrawalAmount: 0,
    totalWalletBalance: 0,

    recentUsers: [],
    recentInvestments: [],
    recentWithdrawals: [],
    recentTransactions: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setDashboard(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Users"
              value={dashboard.totalUsers}
              color="bg-blue-500"
              icon={<FaUsers />}
            />

            <StatCard
              title="Active Users"
              value={dashboard.activeUsers}
              color="bg-green-500"
              icon={<FaUserCheck />}
            />

            <StatCard
              title="Total Investments"
              value={dashboard.totalInvestments}
              color="bg-purple-500"
              icon={<FaChartLine />}
            />

            <StatCard
              title="Investment Amount"
              value={`₹${dashboard.totalInvestmentAmount}`}
              color="bg-indigo-500"
              icon={<FaCoins />}
            />

            <StatCard
              title="Withdrawals"
              value={`₹${dashboard.totalWithdrawalAmount}`}
              color="bg-red-500"
              icon={<FaMoneyBillWave />}
            />

            <StatCard
              title="Wallet Balance"
              value={`₹${dashboard.totalWalletBalance}`}
              color="bg-orange-500"
              icon={<FaWallet />}
            />

            <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Recent Users</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dashboard.recentUsers.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="p-3">{user.fullName}</td>

                        <td className="p-3">{user.email}</td>

                        <td className="p-3">{user.accountStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
