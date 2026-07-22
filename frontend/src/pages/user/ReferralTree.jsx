import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { getReferralTree } from "../../services/referral.service";

const ReferralNode = ({ node }) => {
  return (
    <div className="ml-6 mt-3 border-l-2 border-blue-300 pl-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold">
          {node.user.fullName}
        </h3>

        <p className="text-sm text-gray-500">
          {node.user.email}
        </p>

        <p className="text-xs text-blue-600 mt-1">
          Referral Code: {node.user.referralCode}
        </p>
      </div>

      {node.referrals.length > 0 &&
        node.referrals.map((child) => (
          <ReferralNode
            key={child.user._id}
            node={child}
          />
        ))}
    </div>
  );
};

const ReferralTree = () => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const res = await getReferralTree();
      setTree(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load referral tree");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            Referral Tree
          </h1>

          {loading ? (
            <div>Loading...</div>
          ) : tree.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              No Referrals Found
            </div>
          ) : (
            tree.map((node) => (
              <ReferralNode
                key={node.user._id}
                node={node}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralTree;