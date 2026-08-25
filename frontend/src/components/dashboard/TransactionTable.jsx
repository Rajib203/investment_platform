const TransactionTable = ({ transactions = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Recent Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 text-slate-850 font-bold border-b border-slate-200">
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-slate-650 font-medium"
                >
                  No Transactions Found
                </td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-100 hover:bg-gray-50/50"
                >
                  <td className="p-3 font-medium text-slate-900">{item.type}</td>

                  <td className="p-3 text-slate-700 font-semibold">
                    ₹{item.amount}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "SUCCESS" || item.status === "Success" || item.status === "Completed" || item.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "FAILED" || item.status === "Failed" || item.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status || "Completed"}
                    </span>
                  </td>

                  <td className="p-3 text-slate-600 text-xs font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
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

export default TransactionTable;