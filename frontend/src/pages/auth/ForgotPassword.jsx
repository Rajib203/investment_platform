import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const res = await forgotPassword(email);

      toast.success(res.data.message);

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Enter your registered email address.
        </p>

        <form onSubmit={submitHandler}>

          <div className="mb-5">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <div className="text-center mt-5">

          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;