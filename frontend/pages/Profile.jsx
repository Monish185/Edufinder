import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium">Account Type</p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {user.isAdmin ? "👑 Admin" : "👤 User"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium">Subscription</p>
              <p className={`text-sm font-bold mt-1 ${user.subscriptionStatus === "active" ? "text-emerald-600" : "text-gray-400"}`}>
                {user.subscriptionStatus === "active"
                  ? `✓ ${user.subscriptionPlan?.toUpperCase()}`
                  : "No active plan"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/favorites" className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl text-sm font-semibold text-center transition">
              ❤️ My Favorites
            </Link>
            {user.subscriptionStatus !== "active" && (
              <Link to="/subscribe" className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-xl text-sm font-semibold text-center transition">
                ⭐ Upgrade Plan
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
