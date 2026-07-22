import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    adminSecret: "", // Optional secret key
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 // src/pages/admin/AdminRegister.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post("/auth/admin/register", formData);

    // ❌ DO NOT save token/user in localStorage
    // localStorage.setItem("token", token);
    // localStorage.setItem("user", JSON.stringify(user));

    toast.success("Admin registered successfully! Please log in.");

    // Redirect to login page instead of dashboard
    navigate("/admin/login");
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Failed to create admin account."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-white">Create Admin</h2>
          <p className="text-gray-400 text-sm mt-1">
            Register a new administrative account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              required
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Admin Secret Key (If configured)
            </label>
            <input
              type="password"
              name="adminSecret"
              value={formData.adminSecret}
              onChange={handleChange}
              placeholder="Enter secret key"
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? "Registering..." : "Register Admin"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/admin/login"
            className="text-xs text-blue-400 hover:underline"
          >
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;