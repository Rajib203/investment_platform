import { useState } from "react";
import { createDeposit } from "../../services/deposit.service";
import toast from "react-hot-toast";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const Deposit = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "BANK",
    transactionId: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setPaymentScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (paymentScreenshot) {
        data.append("paymentScreenshot", paymentScreenshot);
      }

      const res = await createDeposit(data);

      toast.success(res.data.message);

      setFormData({
        amount: "",
        paymentMethod: "BANK",
        transactionId: "",
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
      });

      setPaymentScreenshot(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Deposit Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-slate-900">
              Deposit Funds
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Deposit Instructions Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">
                  Company Deposit Instructions
                </h3>

                {formData.paymentMethod === "BANK" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                    <p><span className="font-semibold">Bank Name:</span> <strong className="text-slate-900 font-bold">State Bank of India</strong></p>
                    <p><span className="font-semibold">Account Name:</span> <strong className="text-slate-900 font-bold">Investment Platform</strong></p>
                    <p><span className="font-semibold">Account Number:</span> <strong className="text-slate-900 font-bold font-mono">123456789012</strong></p>
                    <p><span className="font-semibold">IFSC Code:</span> <strong className="text-slate-900 font-bold font-mono">SBIN0001234</strong></p>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold">UPI ID:</span> <strong className="text-slate-900 font-bold font-mono">investment@upi</strong></p>
                    <p className="text-xs text-slate-500 font-medium">
                      Scan or enter the above UPI ID in your UPI app to complete the transaction.
                    </p>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Deposit Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                  placeholder="Enter Amount"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                >
                  <option value="BANK">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Transaction ID / UTR
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-mono text-sm"
                  placeholder="Enter Transaction ID"
                  required
                />
              </div>

              {/* BANK DETAILS FIELDS */}
              {formData.paymentMethod === "BANK" && (
                <div className="grid md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Your Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                      placeholder="e.g. HDFC Bank"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                      placeholder="Name on your account"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-mono text-sm"
                      placeholder="Your account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-mono text-sm uppercase"
                      placeholder="e.g. HDFC0001234"
                    />
                  </div>
                </div>
              )}

              {/* UPI DETAILS FIELD */}
              {formData.paymentMethod === "UPI" && (
                <div className="pt-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-mono text-sm"
                    placeholder="e.g. username@upi"
                  />
                </div>
              )}

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Payment Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-2.5 bg-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-bold transition duration-200 shadow-sm focus:outline-none cursor-pointer"
              >
                {loading ? "Submitting Request..." : "Submit Deposit Request"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Deposit;