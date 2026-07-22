import toast from "react-hot-toast";
import { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Navbar from "../../components/Layout/Navbar";
import { createWithdrawal } from "../../services/withdrawal.service";

const Withdrawal = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    paymentMethod: "BANK",

    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",

    upiId: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await createWithdrawal(form);

      toast.success(data.message);

      setForm({
        amount: "",
        paymentMethod: "BANK",

        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",

        upiId: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">

          <div className="bg-white rounded-xl shadow p-8 max-w-3xl">

            <h2 className="text-2xl font-bold mb-6">
              Withdraw Funds
            </h2>

            <form
              onSubmit={submitHandler}
              className="space-y-5"
            >
              <div>
                <label className="font-medium">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="font-medium">
                  Payment Method
                </label>

                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-lg p-3"
                >
                  <option value="BANK">
                    BANK
                  </option>

                  <option value="UPI">
                    UPI
                  </option>
                </select>
              </div>

              {form.paymentMethod === "BANK" && (
                <>
                  <input
                    type="text"
                    name="bankName"
                    placeholder="Bank Name"
                    value={form.bankName}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                  />

                  <input
                    type="text"
                    name="accountHolderName"
                    placeholder="Account Holder Name"
                    value={form.accountHolderName}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                  />

                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    value={form.accountNumber}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                  />

                  <input
                    type="text"
                    name="ifscCode"
                    placeholder="IFSC Code"
                    value={form.ifscCode}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                  />
                </>
              )}

              {form.paymentMethod === "UPI" && (
                <input
                  type="text"
                  name="upiId"
                  placeholder="UPI ID"
                  value={form.upiId}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                />
              )}

              <button
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                {loading
                  ? "Submitting..."
                  : "Request Withdrawal"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;