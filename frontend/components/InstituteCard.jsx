import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const categoryColors = {
  Engineering: "bg-blue-100 text-blue-700",
  Medical: "bg-red-100 text-red-700",
  Commerce: "bg-orange-100 text-orange-700",
  Arts: "bg-purple-100 text-purple-700",
  Science: "bg-cyan-100 text-cyan-700",
  Law: "bg-gray-100 text-gray-700",
  Management: "bg-teal-100 text-teal-700",
  Coaching: "bg-indigo-100 text-indigo-700",
  Other: "bg-green-100 text-green-700",
};

const InstituteCard = ({ institute }) => {
  const { user } = useAuth();
  const [favMsg, setFavMsg] = useState("");
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setFavMsg("Login to save");
      setTimeout(() => setFavMsg(""), 2000);
      return;
    }

    setIsFavLoading(true);
    try {
      const res = await API.post("/users/favorites", { instituteId: institute._id });
      setFavMsg(res.data.message || "Saved!");
      setTimeout(() => setFavMsg(""), 2000);
    } catch {
      setFavMsg("Error saving");
    } finally {
      setIsFavLoading(false);
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const half = (rating || 0) % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span className="text-amber-400">
        {"★".repeat(full)}
        {half ? "⯨" : ""}
        <span className="text-gray-300">{"★".repeat(empty)}</span>
      </span>
    );
  };

  const catColor = categoryColors[institute.category] || "bg-indigo-100 text-indigo-700";
  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(institute.name)}&background=4f46e5&color=ffffff&size=400&bold=true`;

  return (
    <Link
      to={`/institutes/${institute._id}`}
      className="group block"
      aria-label={`View details for ${institute.name}`}
    >
      <article className="institute-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
        <div className="relative overflow-hidden bg-gray-100 h-48 flex-shrink-0">
          <img
            src={imgError ? fallbackImg : institute.image}
            alt={`${institute.name} campus`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {institute.category && (
            <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${catColor}`}>
              {institute.category}
            </span>
          )}

          {institute.distanceInKm && (
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              📍 {institute.distanceInKm} km
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            disabled={isFavLoading}
            className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-sm transition hover:scale-110 active:scale-95"
            aria-label="Save to favorites"
          >
            {isFavLoading ? (
              <span className="text-sm animate-spin">⟳</span>
            ) : (
              <span className="text-base">❤️</span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-base font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-700 transition-colors line-clamp-2">
            {institute.name}
          </h2>

          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">
              {institute.city}{institute.state ? `, ${institute.state}` : ""}
            </span>
          </p>

          {institute.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {renderStars(institute.rating)}
              <span className="text-xs text-gray-500 font-medium">({institute.rating}/5)</span>
            </div>
          )}

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
            {institute.description || "Discover quality education at this top-rated institute."}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {institute.fees ? (
              <div>
                <span className="text-xs text-gray-400">Annual fees</span>
                <p className="text-sm font-bold text-indigo-700">
                  ₹{institute.fees.toLocaleString("en-IN")}
                </p>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">Fees on enquiry</span>
            )}

            <span className="text-xs text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View →
            </span>
          </div>
        </div>

        {favMsg && (
          <div className="absolute inset-x-0 bottom-0 bg-emerald-600 text-white text-center text-xs font-medium py-2 rounded-b-2xl">
            {favMsg}
          </div>
        )}
      </article>
    </Link>
  );
};

export default InstituteCard;
