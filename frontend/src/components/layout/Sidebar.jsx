import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Receipt,
  History,
  ArrowDownCircle,
} from "lucide-react";
import {
  Users,
  Network,
  DollarSign,
} from "lucide-react";

const userNavItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "ROI History",
    path: "/roi-history",
    icon: TrendingUp,
  },
  {
    name: "Deposit",
    path: "/deposit",
    icon: ArrowDownCircle,
  },
  {
    name: "Deposit History",
    path: "/user/deposit-history",
    icon: History,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    name: "KYC",
    path: "/kyc",
    icon: ShieldCheck,
  },
  {
    name: "Investments",
    path: "/investments",
    icon: TrendingUp,
  },
  {
    name: "Wallet",
    path: "/wallet",
    icon: Wallet,
  },
  {
    name: "Wallet History",
    path: "/wallet/history",
    icon: History,
  },
  {
    name: "Withdraw",
    path: "/withdraw",
    icon: ArrowUpRight,
  },
  {
    name: "Withdrawal History",
    path: "/withdraw/history",
    icon: History,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: Receipt,
  },
  {
  name: "Direct Referrals",
  path: "/referrals",
  icon: Users,
},
{
  name: "Referral Income",
  path: "/referral-income",
  icon: DollarSign,
},
{
  name: "Referral Tree",
  path: "/referral-tree",
  icon: Network,
}
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5 border-r border-slate-800 flex flex-col justify-between">
      <div>
        <div className="mb-8 px-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Investment
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">User Portal</p>
        </div>

        <nav className="space-y-1.5">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 px-3">
        <span className="text-xs text-slate-500 font-medium">
          User Dashboard
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
