import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// User Pages
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import UserInvestments from "../pages/user/Investments";
import KYC from "../pages/user/KYC";
import Deposit from "../pages/user/Deposit";
import DepositHistory from "../pages/user/DepositHistory";
import Wallet from "../pages/user/Wallet";
import WalletHistory from "../pages/user/WalletHistory";
import UserTransactions from "../pages/user/Transactions";

import DirectReferrals from "../pages/user/DirectReferrals";
import ReferralIncome from "../pages/user/ReferralIncome";
import ReferralTree from "../pages/user/ReferralTree";

// Admin Pages
import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminPlans from "../pages/admin/Plans";
import AdminRegister from "../pages/admin/AdminRegister";

// Inside <Routes>
<Route path="/admin/register" element={<AdminRegister />} />;
import AdminInvestments from "../pages/admin/Investments";
import InvestmentDetails from "../pages/admin/InvestmentDetails";
import AdminWithdrawals from "../pages/admin/Withdrawals";
import AdminTransactions from "../pages/admin/Transactions";
import TransactionDetails from "../pages/admin/TransactionDetails";
import AdminKYC from "../pages/admin/KYC";
import KYCDetails from "../pages/admin/KYCDetails";
import AdminDeposits from "../pages/admin/AdminDeposits";
import Withdrawal from "../pages/user/Withdrawal";
import WithdrawalHistory from "../pages/user/WithdrawalHistory";
import WithdrawalDetails from "../pages/admin/WithdrawalDetails"; // Check path
// Middleware
import ProtectedRoute from "./ProtectedRoute";
import ROIHistory from "../pages/user/ROIHistory";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= Public ================= */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= User ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <UserInvestments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Deposit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/deposit-history"
          element={
            <ProtectedRoute>
              <DepositHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet/history"
          element={
            <ProtectedRoute>
              <WalletHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <UserTransactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kyc"
          element={
            <ProtectedRoute>
              <KYC />
            </ProtectedRoute>
          }
        />

        {/* ================= Admin ================= */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/users" element={<AdminUsers />} />

        <Route path="/admin/plans" element={<AdminPlans />} />

        <Route path="/admin/investments" element={<AdminInvestments />} />

        <Route path="/admin/investments/:id" element={<InvestmentDetails />} />

        <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />

        <Route path="/admin/deposits" element={<AdminDeposits />} />

        <Route path="/admin/transactions" element={<AdminTransactions />} />

        <Route
          path="/admin/transactions/:id"
          element={<TransactionDetails />}
        />

        <Route path="/admin/kyc" element={<AdminKYC />} />

        <Route path="/admin/kyc/:id" element={<KYCDetails />} />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdrawal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw/history"
          element={
            <ProtectedRoute>
              <WithdrawalHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/withdrawals/:id" element={<WithdrawalDetails />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/roi-history"
          element={
            <ProtectedRoute>
              <ROIHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <DirectReferrals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/referral-income"
          element={
            <ProtectedRoute>
              <ReferralIncome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/referral-tree"
          element={
            <ProtectedRoute>
              <ReferralTree />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
