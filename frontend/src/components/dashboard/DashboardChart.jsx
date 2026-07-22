import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DashboardChart = () => {
  const data = [
    { month: "Jan", roi: 200 },
    { month: "Feb", roi: 400 },
    { month: "Mar", roi: 650 },
    { month: "Apr", roi: 900 },
    { month: "May", roi: 1300 },
    { month: "Jun", roi: 1800 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold mb-6">
        ROI Growth
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="roi"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;