import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import {
  getAllKYC,
} from "../../services/adminKyc.service";
import toast from "react-hot-toast";

const KYC = () => {
  const [kycs, setKycs] = useState([]);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      const res = await getAllKYC();
      setKycs(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load KYC");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            KYC Management
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Aadhaar</th>
                    <th className="p-3 text-left">PAN</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Documents</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>

                </thead>

                <tbody>

                  {kycs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-6 text-gray-500"
                      >
                        No KYC Requests Found
                      </td>
                    </tr>
                  ) : (
                    kycs.map((kyc) => (
                      <tr
                        key={kyc._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <div className="font-semibold">
                            {kyc.user?.fullName}
                          </div>

                          <div className="text-sm text-gray-500">
                            {kyc.user?.email}
                          </div>
                        </td>

                        <td className="p-3">
                          {kyc.aadhaarNumber}
                        </td>

                        <td className="p-3">
                          {kyc.panNumber}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-white ${
                              kyc.status === "Approved"
                                ? "bg-green-600"
                                : kyc.status === "Rejected"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                            }`}
                          >
                            {kyc.status}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-col gap-1">

                            <a
                              href={kyc.aadhaarFront}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Aadhaar Front
                            </a>

                            <a
                              href={kyc.aadhaarBack}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Aadhaar Back
                            </a>

                            <a
                              href={kyc.panCardImage}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              PAN Card
                            </a>

                            <a
                              href={kyc.selfieImage}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Selfie
                            </a>

                          </div>
                        </td>

                        <td className="p-3 text-center">
                          <Link
                            to={`/admin/kyc/${kyc._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                          >
                            View Details
                          </Link>
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default KYC;