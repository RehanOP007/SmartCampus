import { AuthProvider, useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { username, role, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome {username}</h1>
        <p className="mb-4">Role: {role}</p>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default Dashboard;