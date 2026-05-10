import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const InstituteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favMsg, setFavMsg] = useState("");
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        const res = await API.get(`/institutes/${id}`);
        setInstitute(res.data);
        // SEO: update page title
        document.title = `${res.data.name} – EduFinder`;
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchInstitute();
    return () => { document.title = "EduFinder – Find Institutes Near You"; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await API.delete(`/institutes/${id}`);
      navigate("/");
    } catch { alert("Delete failed."); }
  };

  const handleFavorite = async () => {
    if (!user) { setFavMsg("Please login to save favorites."); return; }
    try {
      const res = await API.post("/users/favorites", { instituteId: institute._id });
      setFavMsg(res.data.message || "Saved!");
      setTimeout(() => setFavMsg(""), 3000);
    } catch { setFavMsg("Something went wrong."); }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const half = (rating || 0) % 1 >= 0.5;
    return (
      <span className="text-amber-400 text-2xl tracking-wider">
        {"★".repeat(full)}
        {half ? "⯨" : ""}
        <span className="text-gray-200">{"★".repeat(5 - full - (half ? 1 : 0))}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="skeleton h-96 w-full rounded-2xl mb-4" />
          <div className="skeleton h-8 w-2/3 mb-3" />
          <div className="skeleton h-4 w-1/3 mb-6" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-80 text-gray-500">
          <span className="text-5xl mb-3">🏫</span>
          <p className="text-lg font-semibold mb-2">Institute not found</p>
          <button onClick={() => navigate("/")} className="mt-2 text-indigo-600 hover:underline text-sm">
            ← Back to listings
          </button>
        </div>
      </div>
    );
  }

  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(institute.name)}&background=4f46e5&color=ffffff&size=800&bold=true`;
  const mapUrl = institute.location?.coordinates
    ? `https://www.google.com/maps?q=${institute.location.coordinates[1]},${institute.location.coordinates[0]}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      {/* Structured data for this listing */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": institute.name,
        "description": institute.description,
        "address": { "@type": "PostalAddress", "addressLocality": institute.city, "addressRegion": institute.state },
        "aggregateRating": institute.rating ? { "@type": "AggregateRating", "ratingValue": institute.rating, "bestRating": 5 } : undefined,
      })}} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-5" aria-label="Breadcrumb">
          <button onClick={() => navigate("/")} className="hover:text-indigo-600 transition">Home</button>
          <span>/</span>
          <button onClick={() => navigate(-1)} className="hover:text-indigo-600 transition">Institutes</button>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{institute.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100 overflow-hidden">
            <img
              src={imgError ? fallbackImg : institute.image}
              alt={`${institute.name} campus`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Category badge */}
            {institute.category && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-indigo-700 text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm">
                {institute.category}
              </span>
            )}

            {/* Bottom info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow">
                {institute.name}
              </h1>
              <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {institute.address || institute.city}{institute.state ? `, ${institute.state}` : ""}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8">
            {/* Actions Row */}
            <div className="flex flex-wrap gap-3 mb-6">
              {user && (
                <button
                  onClick={handleFavorite}
                  className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-5 py-2.5 rounded-xl border border-rose-200 transition text-sm"
                >
                  ❤️ Save to Favorites
                </button>
              )}

              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-5 py-2.5 rounded-xl border border-blue-200 transition text-sm"
                >
                  🗺 View on Google Maps
                </a>
              )}

              {user?.isAdmin && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 font-medium px-4 py-2.5 rounded-xl border border-gray-200 hover:border-red-200 transition text-sm ml-auto"
                >
                  🗑 Delete Listing
                </button>
              )}
            </div>

            {favMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
                {favMsg}
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {institute.rating > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Rating</p>
                  <div className="text-sm">{renderStars(institute.rating)}</div>
                  <p className="text-sm text-gray-600 font-semibold mt-1">{institute.rating}/5</p>
                </div>
              )}

              {institute.fees && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Annual Fees</p>
                  <p className="text-xl font-bold text-indigo-700">
                    ₹{institute.fees.toLocaleString("en-IN")}
                  </p>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Category</p>
                <p className="text-sm font-bold text-emerald-700">{institute.category || "Education"}</p>
              </div>

              {institute.createdBy?.name && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Listed By</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{institute.createdBy.name}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {institute.description && (
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About this Institute</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{institute.description}</p>
              </section>
            )}

            {/* Embedded Map preview */}
            {institute.location?.coordinates && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <iframe
                    title={`Map for ${institute.name}`}
                    src={`https://maps.google.com/maps?q=${institute.location.coordinates[1]},${institute.location.coordinates[0]}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm font-medium mt-2"
                >
                  Open in Google Maps →
                </a>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDetails;
