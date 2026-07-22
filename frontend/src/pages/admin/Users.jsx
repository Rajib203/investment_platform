import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  makeAdmin,
  removeAdmin,
} from "../../services/admin.service";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    }
  };

  const handleBlock = async (id) => {
    try {
      await blockUser(id);
      toast.success("User Blocked");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const handleUnblock = async (id) => {
    try {
      await unblockUser(id);
      toast.success("User Unblocked");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await makeAdmin(id);
      toast.success("User Promoted");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      await removeAdmin(id);
      toast.success("Admin Removed");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          <h1 className="text-3xl font-bold mb-6">
            User Management
          </h1>

          <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user._id} className="border-b">

                    <td className="p-3">{user.fullName}</td>

                    <td className="p-3">{user.email}</td>

                    <td className="p-3">{user.role}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          user.accountStatus === "Active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>

                    <td className="p-3">

                      <div className="flex flex-wrap gap-2 justify-center">

                        {user.accountStatus === "Active" ? (
                          <button
                            onClick={() => handleBlock(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblock(user._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Unblock
                          </button>
                        )}

                        {user.role === "USER" ? (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemoveAdmin(user._id)}
                            className="bg-orange-500 text-white px-3 py-1 rounded"
                          >
                            Remove Admin
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Users;