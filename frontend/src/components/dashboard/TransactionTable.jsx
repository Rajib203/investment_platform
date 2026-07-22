const TransactionTable = ({ transactions = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Recent Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
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
                  className="text-center p-6 text-gray-500"
                >
                  No Transactions Found
                </td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{item.type}</td>

                  <td className="p-3">
                    ₹{item.amount}
                  </td>

                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3">
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