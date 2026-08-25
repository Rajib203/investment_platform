const InvestmentTable = ({ investments = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Recent Investments
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-850 font-bold border-b border-slate-200 text-sm">

              <th className="p-3">Plan</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Daily ROI</th>
              <th className="p-3">Status</th>
              <th className="p-3">Start Date</th>

            </tr>
          </thead>

          <tbody>

            {investments.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-slate-600 font-medium"
                >
                  No Investments Found
                </td>
              </tr>

            ) : (

              investments.map((item) => (

                <tr
                  key={item._id}
                  className="border-b border-slate-100 hover:bg-gray-50/50"
                >
                  <td className="p-3 font-medium text-slate-900">
                    {item.planName}
                  </td>

                  <td className="p-3 text-slate-700">
                    ₹{item.amount}
                  </td>

                  <td className="p-3 text-slate-700">
                    {item.dailyROIPercentage}%
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="p-3 text-slate-600 text-xs font-medium">
                    {new Date(item.startDate).toLocaleDateString()}
                  </td>

                </tr>

              ))

            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestmentTable;