import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/auth.service";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    referralCode: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      setFormData((prev) => ({
        ...prev,
        referralCode: ref.toUpperCase(),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await register(formData);

      toast.success(
        "Account created successfully! Please login."
      );

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">

      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-white">
            Create Account
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Join us to manage your investments
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

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
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
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
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Referral Code (Optional)
            </label>

            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Enter Referral Code"
              className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <div className="text-center mt-5">

          <Link
            to="/login"
            className="text-blue-400 hover:underline text-sm"
          >
            Already have an account? Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Register;