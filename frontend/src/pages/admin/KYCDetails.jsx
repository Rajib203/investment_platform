import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaIdCard } from "react-icons/fa";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import { getKYCById } from "../../services/kyc.service";

const KYCDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      const res = await getKYCById(id);
      setKyc(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-10 text-center text-slate-500 font-medium">
            Loading KYC details...
          </div>
        </div>
      </div>
    );
  }

  if (!kyc) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-10 text-center space-y-4">
            <p className="text-slate-500 font-medium">KYC request not found.</p>
            <button
              onClick={() => navigate("/admin/kyc")}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Back to KYC List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6">
          {/* Top Navigation */}
          <button
            onClick={() => navigate("/admin/kyc")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
          >
            <FaArrowLeft size={14} /> Back to All KYC Requests
          </button>

          <h1 className="text-3xl font-bold mb-6 text-slate-900 flex items-center gap-2">
            <FaIdCard className="text-indigo-600" size={26} /> KYC Details
          </h1>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-slate-800">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-slate-100 pb-2 text-slate-800">
                  Personal Information
                </h2>

                <div className="space-y-3 text-sm">
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Full Name:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.fullName}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Email:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.user?.email}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Mobile:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.user?.mobileNumber}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Date of Birth:</strong>{" "}
                    <span className="text-slate-800 font-medium">{new Date(kyc.dateOfBirth).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Address:</strong> 
                    <span className="text-slate-850 font-medium max-w-xs text-right">{kyc.address}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">City:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.city}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">State:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.state}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Country:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.country}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Pincode:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.pincode}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Aadhaar Number:</strong> 
                    <span className="text-slate-800 font-mono font-medium">{kyc.aadhaarNumber}</span>
                  </p>
                  <p className="flex justify-between pb-2">
                    <strong className="text-slate-500 font-semibold">PAN Number:</strong> 
                    <span className="text-slate-800 font-mono font-medium">{kyc.panNumber}</span>
                  </p>
                </div>
              </div>

              {/* Bank Information */}
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-slate-100 pb-2 text-slate-800">
                  Bank Information
                </h2>

                <div className="space-y-3 text-sm">
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Bank Name:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.bankName}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Account Holder:</strong> 
                    <span className="text-slate-800 font-medium">{kyc.accountHolderName}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Account Number:</strong> 
                    <span className="text-slate-800 font-mono font-medium">{kyc.accountNumber}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">IFSC Code:</strong> 
                    <span className="text-slate-800 font-mono font-medium">{kyc.ifscCode}</span>
                  </p>
                  <p className="flex justify-between border-b border-slate-100 pb-2">
                    <strong className="text-slate-500 font-semibold">Status:</strong> 
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      kyc.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : kyc.status === "Rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-850"
                    }`}>
                      {kyc.status}
                    </span>
                  </p>

                  {kyc.remark && (
                    <p className="flex justify-between pb-2 bg-slate-50 p-2 rounded border border-slate-200">
                      <strong className="text-slate-500 font-semibold">Remark:</strong> 
                      <span className="text-slate-800 font-medium text-right max-w-xs">{kyc.remark}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold mb-6 text-slate-800">Uploaded Documents</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Aadhaar Front</p>
                <img
                  src={kyc.aadhaarFront}
                  alt="Aadhaar Front"
                  className="rounded-lg border border-slate-200 w-full h-56 object-cover shadow-sm bg-slate-50"
                />
              </div>

              <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Aadhaar Back</p>
                <img
                  src={kyc.aadhaarBack}
                  alt="Aadhaar Back"
                  className="rounded-lg border border-slate-200 w-full h-56 object-cover shadow-sm bg-slate-50"
                />
              </div>

              <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">PAN Card</p>
                <img
                  src={kyc.panCardImage}
                  alt="PAN Card"
                  className="rounded-lg border border-slate-200 w-full h-56 object-cover shadow-sm bg-slate-50"
                />
              </div>

              <div>
                <p className="font-semibold text-slate-700 text-sm mb-2">Selfie</p>
                <img
                  src={kyc.selfieImage}
                  alt="Selfie"
                  className="rounded-lg border border-slate-200 w-full h-56 object-cover shadow-sm bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;
