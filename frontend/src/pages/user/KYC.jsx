import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { submitKYC, getMyKYC } from "../../services/kyc.service";
import toast from "react-hot-toast";

const KYC = () => {
  const [kyc, setKyc] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    aadhaarNumber: "",
    panNumber: "",

    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",

    aadhaarFront: null,
    aadhaarBack: null,
    panCardImage: null,
    selfieImage: null,
  });

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      const res = await getMyKYC();

      if (res.data.success) {
        setKyc(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({
        ...form,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          data.append(key, form[key]);
        }
      });

      await submitKYC(data);

      toast.success("KYC Submitted Successfully");

      fetchKYC();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "KYC Submission Failed"
      );
    }
  };

  if (kyc) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="p-6">
            <div className="bg-white rounded-xl shadow-lg p-8">

              <h1 className="text-3xl font-bold mb-6">
                KYC Status
              </h1>

              <div
                className={`inline-block px-5 py-3 rounded-lg text-white ${
                  kyc.status === "Approved"
                    ? "bg-green-600"
                    : kyc.status === "Rejected"
                    ? "bg-red-600"
                    : "bg-yellow-500"
                }`}
              >
                {kyc.status}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-6">

          <div className="bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold mb-8">
              Submit KYC
            </h1>

            <form onSubmit={handleSubmit}>

              <div className="grid md:grid-cols-2 gap-5">
                              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="border rounded-lg p-3"
                value={form.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="dateOfBirth"
                className="border rounded-lg p-3"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />

              <textarea
                name="address"
                placeholder="Full Address"
                className="border rounded-lg p-3 md:col-span-2"
                rows={3}
                value={form.address}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                className="border rounded-lg p-3"
                value={form.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                className="border rounded-lg p-3"
                value={form.state}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                className="border rounded-lg p-3"
                value={form.pincode}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="aadhaarNumber"
                placeholder="Aadhaar Number"
                className="border rounded-lg p-3"
                value={form.aadhaarNumber}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="panNumber"
                placeholder="PAN Number"
                className="border rounded-lg p-3"
                value={form.panNumber}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                className="border rounded-lg p-3"
                value={form.bankName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="accountHolderName"
                placeholder="Account Holder Name"
                className="border rounded-lg p-3"
                value={form.accountHolderName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                className="border rounded-lg p-3"
                value={form.accountNumber}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                className="border rounded-lg p-3"
                value={form.ifscCode}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block mb-2 font-medium">
                  Aadhaar Front
                </label>
                <input
                  type="file"
                  name="aadhaarFront"
                  accept="image/*"
                  className="border rounded-lg p-3 w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Aadhaar Back
                </label>
                <input
                  type="file"
                  name="aadhaarBack"
                  accept="image/*"
                  className="border rounded-lg p-3 w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  PAN Card
                </label>
                <input
                  type="file"
                  name="panCardImage"
                  accept="image/*"
                  className="border rounded-lg p-3 w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Selfie
                </label>
                <input
                  type="file"
                  name="selfieImage"
                  accept="image/*"
                  className="border rounded-lg p-3 w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              </div>
                            <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Submit KYC
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default KYC;