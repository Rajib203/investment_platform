import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getProfile } from "../../services/user.service";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-10 text-center text-slate-500 font-medium">
            Loading Profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-slate-900">
            My Profile
          </h1>

          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 max-w-2xl">
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Full Name
                </h3>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {user.fullName}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Email Address
                </h3>
                <p className="text-slate-900 font-medium mt-1">
                  {user.email}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Mobile Number
                </h3>
                <p className="text-slate-900 font-medium mt-1">
                  {user.mobileNumber}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Referral Code
                </h3>
                <p className="text-slate-900 font-mono font-medium mt-1">
                  {user.referralCode}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Wallet Balance
                </h3>
                <p className="text-xl font-bold text-green-600 mt-1">
                  ₹{user.walletBalance}
                </p>
              </div>

              <div>
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                  Account Status
                </h3>
                <div className="mt-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {user.accountStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;