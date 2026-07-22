import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await login(form);

      // Check Admin Role
      if (res.data.user.role !== "ADMIN") {
        toast.error("You are not an Admin");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Admin Login Successful");

      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <div className="bg-white w-[420px] rounded-xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Admin Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Investment Platform Admin Panel
        </p>

        <form onSubmit={handleSubmit}>

          <div className="mb-5">

            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-4 py-3"
              placeholder="Admin Email"
              required
            />

          </div>

          <div className="mb-6">

            <label className="font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-4 py-3"
              placeholder="Password"
              required
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;