import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import API from "../services/api";
import InstituteCard from "../components/InstituteCard";
import Loader from "../components/Loader";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get("/users/favorites");
        setFavorites(res.data.favorites);
      } catch { }
      finally { setLoading(false); }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition text-sm shadow-sm">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Saved Institutes</h1>
            {!loading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {favorites.length} {favorites.length === 1 ? "institute" : "institutes"} saved
              </p>
            )}
          </div>
        </div>

        {loading && <Loader count={3} />}

        {!loading && favorites.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm fade-in">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">❤️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No saved institutes yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              Browse institutes and tap the ❤️ button on any card to save it here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-100"
            >
              Browse Institutes
            </button>
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
            {favorites.map((institute) => (
              <InstituteCard key={institute._id} institute={institute} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
