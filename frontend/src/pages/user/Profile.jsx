import { useEffect, useState } from "react";
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
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="bg-white shadow rounded-xl p-8">

        <div className="space-y-4">

          <div>
            <h3 className="text-gray-500">
              Full Name
            </h3>

            <p className="text-xl font-semibold">
              {user.fullName}
            </p>
          </div>

          <div>
            <h3 className="text-gray-500">
              Email
            </h3>

            <p>{user.email}</p>
          </div>

          <div>
            <h3 className="text-gray-500">
              Mobile Number
            </h3>

            <p>{user.mobileNumber}</p>
          </div>

          <div>
            <h3 className="text-gray-500">
              Referral Code
            </h3>

            <p>{user.referralCode}</p>
          </div>

          <div>
            <h3 className="text-gray-500">
              Wallet Balance
            </h3>

            <p>₹{user.walletBalance}</p>
          </div>

          <div>
            <h3 className="text-gray-500">
              Account Status
            </h3>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {user.accountStatus}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;