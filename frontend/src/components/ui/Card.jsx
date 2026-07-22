const Card = ({ title, value, color }) => {
  return (
    <div className={`rounded-xl p-6 shadow-md text-white ${color}`}>
      <h3 className="text-lg">{title}</h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
};

export default Card;