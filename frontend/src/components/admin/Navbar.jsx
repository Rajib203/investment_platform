import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-8 py-4 flex justify-between items-center">

      <h2 className="text-2xl font-bold">
        Investment Admin
      </h2>

      <div className="flex items-center gap-5">

        <div className="text-right">
          <p className="font-semibold">
            {user?.fullName}
          </p>

          <p className="text-gray-500 text-sm">
            {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Navbar;