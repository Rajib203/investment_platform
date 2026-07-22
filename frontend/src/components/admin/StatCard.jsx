const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">

      <div>
        <p className="text-gray-500">{title}</p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div className={`${color} text-white p-5 rounded-full text-3xl`}>
        {icon}
      </div>

    </div>
  );
};

export default StatCard;