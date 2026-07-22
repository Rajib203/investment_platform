import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getKYCById } from "../../services/kyc.service";

const KYCDetails = () => {
  const { id } = useParams();

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
    return <div className="p-10">Loading...</div>;
  }

  if (!kyc) {
    return <div className="p-10">KYC not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">KYC Details</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Personal Information
            </h2>

            <div className="space-y-3">
              <p>
                <strong>Full Name:</strong> {kyc.fullName}
              </p>
              <p>
                <strong>Email:</strong> {kyc.user?.email}
              </p>
              <p>
                <strong>Mobile:</strong> {kyc.user?.mobileNumber}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(kyc.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <strong>Address:</strong> {kyc.address}
              </p>
              <p>
                <strong>City:</strong> {kyc.city}
              </p>
              <p>
                <strong>State:</strong> {kyc.state}
              </p>
              <p>
                <strong>Country:</strong> {kyc.country}
              </p>
              <p>
                <strong>Pincode:</strong> {kyc.pincode}
              </p>
              <p>
                <strong>Aadhaar Number:</strong> {kyc.aadhaarNumber}
              </p>
              <p>
                <strong>PAN Number:</strong> {kyc.panNumber}
              </p>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Bank Information
            </h2>

            <div className="space-y-3">
              <p>
                <strong>Bank Name:</strong> {kyc.bankName}
              </p>
              <p>
                <strong>Account Holder:</strong> {kyc.accountHolderName}
              </p>
              <p>
                <strong>Account Number:</strong> {kyc.accountNumber}
              </p>
              <p>
                <strong>IFSC Code:</strong> {kyc.ifscCode}
              </p>
              <p>
                <strong>Status:</strong> {kyc.status}
              </p>

              {kyc.remark && (
                <p>
                  <strong>Remark:</strong> {kyc.remark}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-semibold mb-6">Uploaded Documents</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-medium mb-2">Aadhaar Front</p>
            <img
              src={kyc.aadhaarFront}
              alt="Aadhaar Front"
              className="rounded-lg border w-full h-56 object-cover"
            />
          </div>

          <div>
            <p className="font-medium mb-2">Aadhaar Back</p>
            <img
              src={kyc.aadhaarBack}
              alt="Aadhaar Back"
              className="rounded-lg border w-full h-56 object-cover"
            />
          </div>

          <div>
            <p className="font-medium mb-2">PAN Card</p>
            <img
              src={kyc.panCardImage}
              alt="PAN Card"
              className="rounded-lg border w-full h-56 object-cover"
            />
          </div>

          <div>
            <p className="font-medium mb-2">Selfie</p>
            <img
              src={kyc.selfieImage}
              alt="Selfie"
              className="rounded-lg border w-full h-56 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;
