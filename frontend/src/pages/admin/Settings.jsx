import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../services/adminPlan.service";
import toast from "react-hot-toast";

const Plans = () => {
  const [plans, setPlans] = useState([]);

  const [form, setForm] = useState({
    planName: "",
    amount: "",
    dailyROIPercentage: "",
    duration: "",
    status: true,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await getPlans();
      setPlans(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load plans");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "status"
          ? value === "true"
          : value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      planName: "",
      amount: "",
      dailyROIPercentage: "",
      duration: "",
      status: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updatePlan(editingId, form);
        toast.success("Plan Updated Successfully");
      } else {
        await createPlan(form);
        toast.success("Plan Created Successfully");
      }

      resetForm();
      fetchPlans();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Operation Failed"
      );
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);

    setForm({
      planName: plan.planName,
      amount: plan.amount,
      dailyROIPercentage: plan.dailyROIPercentage,
      duration: plan.duration,
      status: plan.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await deletePlan(id);

      toast.success("Plan Deleted");

      fetchPlans();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete Failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          <h1 className="text-3xl font-bold mb-6">
            Plan Management
          </h1>

          {/* Form */}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

            <h2 className="text-xl font-bold mb-5">
              {editingId ? "Update Plan" : "Create Plan"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-4"
            >

              <input
                type="text"
                name="planName"
                placeholder="Plan Name"
                className="border rounded-lg p-3"
                value={form.planName}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                className="border rounded-lg p-3"
                value={form.amount}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                step="0.1"
                name="dailyROIPercentage"
                placeholder="Daily ROI (%)"
                className="border rounded-lg p-3"
                value={form.dailyROIPercentage}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="duration"
                placeholder="Duration (Days)"
                className="border rounded-lg p-3"
                value={form.duration}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  {editingId
                    ? "Update Plan"
                    : "Create Plan"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>

          {/* Table */}

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5">
              All Investment Plans
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-3 text-left">Plan</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">ROI</th>
                    <th className="p-3 text-left">Duration</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {plans.map((plan) => (
                    <tr
                      key={plan._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {plan.planName}
                      </td>

                      <td className="p-3">
                        ₹{plan.amount}
                      </td>

                      <td className="p-3">
                        {plan.dailyROIPercentage}%
                      </td>

                      <td className="p-3">
                        {plan.duration} Days
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white ${
                            plan.status
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {plan.status
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3 text-center">

                        <button
                          onClick={() => handleEdit(plan)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(plan._id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}

                  {plans.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center p-6 text-gray-500"
                      >
                        No Plans Found
                      </td>
                    </tr>
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

export default Plans;