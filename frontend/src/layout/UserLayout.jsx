import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-6 text-white overflow-y-auto">
        <Outlet /> {/* This is where the active sub-route renders */}
      </main>
    </div>
  );
};

export default UserLayout;