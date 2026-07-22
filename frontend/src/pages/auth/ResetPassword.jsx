import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/auth.service";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await resetPassword(token, password);

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Enter your new password.
        </p>

        <form onSubmit={submitHandler}>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              New Password
            </label>

            <input
              type="password"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ResetPassword;