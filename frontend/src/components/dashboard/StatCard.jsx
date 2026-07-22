const StatCard = ({ title, value, color, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;