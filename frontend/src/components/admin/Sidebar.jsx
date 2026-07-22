import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaLayerGroup,
  FaChartLine,
  FaMoneyCheckAlt,
  FaExchangeAlt,
  FaWallet,
  FaIdCard,
} from "react-icons/fa";

const Sidebar = () => {
  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Deposits",
      path: "/admin/deposits",
      icon: <FaWallet />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Plans",
      path: "/admin/plans",
      icon: <FaLayerGroup />,
    },
    {
      name: "Investments",
      path: "/admin/investments",
      icon: <FaChartLine />,
    },
    {
      name: "Withdrawals",
      path: "/admin/withdrawals",
      icon: <FaMoneyCheckAlt />,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: <FaExchangeAlt />,
    },
    {
      name: "KYC",
      path: "/admin/kyc",
      icon: <FaIdCard />,
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        Admin Panel
      </div>

      <div className="mt-5">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition ${
                isActive ? "bg-indigo-600" : "hover:bg-slate-800"
              }`
            }
          >
            {menu.icon}
            {menu.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;