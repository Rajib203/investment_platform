import { useEffect, useState } from "react";
import {
  getInvestments,
  createInvestment,
} from "../../services/investment.service";
import { getPlans } from "../../services/plan.service";



const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [plans, setPlans] = useState([]);

  const [form, setForm] = useState({
    amount: "",
    planName: "",
    dailyROIPercentage: "",
    duration: "",
  });

  useEffect(() => {
    fetchInvestments();
    fetchPlans();
  }, []);

  const fetchInvestments = async () => {
    try {
      const res = await getInvestments();
      setInvestments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlans = async () => {
  try {
    const res = await getPlans();
    setPlans(res.data.data);
  } catch (error) {
    console.log(error);
  }
};

 const handlePlanChange = (e) => {
  const selectedPlan = plans.find(
    (plan) => plan.planName === e.target.value
  );

  if (!selectedPlan) return;

  setForm({
    amount: selectedPlan.amount,
    planName: selectedPlan.planName,
    dailyROIPercentage: selectedPlan.dailyROIPercentage,
    duration: selectedPlan.duration,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createInvestment(form);

      alert("Investment Created Successfully");

      setForm({
        amount: "",
        planName: "",
        dailyROIPercentage: "",
        duration: "",
      });

      fetchInvestments();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Investment Failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Investments
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-5">
          Create Investment
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <select
            className="border rounded-lg p-3"
            value={form.planName}
            onChange={handlePlanChange}
            required
          >
            <option value="">Select Investment Plan</option>

            {plans.map((plan) => (
              <option
                key={plan._id}
                value={plan.planName}
              >
                {plan.planName}
              </option>
            ))}
          </select>

          <input
            className="border rounded-lg p-3 bg-gray-100"
            value={form.amount}
            readOnly
            placeholder="Amount"
          />

          <input
            className="border rounded-lg p-3 bg-gray-100"
            value={
              form.dailyROIPercentage
                ? `${form.dailyROIPercentage}%`
                : ""
            }
            readOnly
            placeholder="Daily ROI"
          />

          <input
            className="border rounded-lg p-3 bg-gray-100"
            value={
              form.duration
                ? `${form.duration} Days`
                : ""
            }
            readOnly
            placeholder="Duration"
          />

        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Invest Now
        </button>
      </form>

      <div className="bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Investment History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-gray-100">

                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Daily ROI</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>

              </tr>

            </thead>

            <tbody>

              {investments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500"
                  >
                    No Investments Found
                  </td>
                </tr>
              ) : (
                investments.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{item.planName}</td>

                    <td className="p-3">
                      ₹{item.amount}
                    </td>

                    <td className="p-3">
                      {item.dailyROIPercentage}%
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(item.startDate).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      {new Date(item.endDate).toLocaleDateString()}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Investments;