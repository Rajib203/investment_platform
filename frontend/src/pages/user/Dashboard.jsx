import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import StatCard from "../../components/dashboard/StatCard";
import InvestmentTable from "../../components/dashboard/InvestmentTable";
import WithdrawalTable from "../../components/dashboard/WithdrawalTable";
import TransactionTable from "../../components/dashboard/TransactionTable";
import DashboardChart from "../../components/dashboard/DashboardChart";

import { getDashboard } from "../../services/dashboard.service";
import { getInvestments } from "../../services/investment.service";
import { getWithdrawals } from "../../services/withdrawal.service";
import { getTransactions } from "../../services/transaction.service";

import {
  FaWallet,
  FaChartLine,
  FaMoneyBillWave,
  FaUsers,
  FaLayerGroup,
} from "react-icons/fa";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    walletBalance: 0,
    totalInvestment: 0,
    totalROIEarned: 0,
    totalLevelIncomeEarned: 0,
    activeInvestments: 0,

    referralCode: "",
    referralLink: "",
    directReferrals: 0,
  });

  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchInvestments();
    fetchWithdrawals();
    fetchTransactions();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const res = await getInvestments();
      setInvestments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await getWithdrawals();
      setWithdrawals(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(dashboard.referralCode);
    toast.success("Referral Code Copied");
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(dashboard.referralLink);
    toast.success("Referral Link Copied");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">
            Dashboard
          </h1>

          {/* Dashboard Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

            <StatCard
              title="Wallet Balance"
              value={`₹${dashboard.walletBalance}`}
              color="bg-green-500"
              icon={<FaWallet />}
            />

            <StatCard
              title="Total Investment"
              value={`₹${dashboard.totalInvestment}`}
              color="bg-blue-500"
              icon={<FaChartLine />}
            />

            <StatCard
              title="ROI Earned"
              value={`₹${dashboard.totalROIEarned}`}
              color="bg-purple-500"
              icon={<FaMoneyBillWave />}
            />

            <StatCard
              title="Level Income"
              value={`₹${dashboard.totalLevelIncomeEarned}`}
              color="bg-orange-500"
              icon={<FaUsers />}
            />

            <StatCard
              title="Active Plans"
              value={dashboard.activeInvestments}
              color="bg-red-500"
              icon={<FaLayerGroup />}
            />

          </div>

          {/* ROI Chart */}

          <div className="mt-8">
            <DashboardChart />
          </div>

          {/* Referral Section */}

          <div className="mt-8 bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-bold mb-6">
              Referral Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="font-semibold text-gray-700">
                  Referral Code
                </label>

                <div className="flex mt-2">

                  <input
                    readOnly
                    value={dashboard.referralCode}
                    className="w-full border rounded-l-lg p-3 bg-gray-100"
                  />

                  <button
                    onClick={copyReferralCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r-lg"
                  >
                    Copy
                  </button>

                </div>

              </div>

              <div>

                <label className="font-semibold text-gray-700">
                  Direct Referrals
                </label>

                <div className="mt-2 bg-green-100 text-green-700 text-2xl font-bold rounded-lg p-3">
                  {dashboard.directReferrals}
                </div>

              </div>

            </div>

            <div className="mt-6">

              <label className="font-semibold text-gray-700">
                Referral Link
              </label>

              <div className="flex mt-2">

                <input
                  readOnly
                  value={dashboard.referralLink}
                  className="w-full border rounded-l-lg p-3 bg-gray-100"
                />

                <button
                  onClick={copyReferralLink}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-r-lg"
                >
                  Copy
                </button>

              </div>

            </div>

          </div>

          {/* Investments */}

          <div className="mt-8">
            <InvestmentTable investments={investments} />
          </div>

          {/* Withdrawals */}

          <div className="mt-8">
            <WithdrawalTable withdrawals={withdrawals} />
          </div>

          {/* Transactions */}

          <div className="mt-8">
            <TransactionTable transactions={transactions} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;