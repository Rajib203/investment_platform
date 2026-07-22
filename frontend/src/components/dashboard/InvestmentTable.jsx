const InvestmentTable = ({ investments = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Recent Investments
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">

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
                  <td className="p-3">
                    {item.planName}
                  </td>

                  <td className="p-3">
                    ₹{item.amount}
                  </td>

                  <td className="p-3">
                    {item.dailyROIPercentage}%
                  </td>

                  <td className="p-3">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {item.status}
                    </span>

                  </td>

                  <td className="p-3">
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