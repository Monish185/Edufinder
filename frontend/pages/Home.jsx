import { useEffect, useState, useCallback } from "react";
import NavBar from "../components/NavBar";
import InstituteCard from "../components/InstituteCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import GoogleMapComponent from "../components/GoogleMapComponent";
import API from "../services/api";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "fees_asc", label: "Lowest Fees" },
  { value: "fees_desc", label: "Highest Fees" },
  { value: "distance_asc", label: "Nearest First" },
];

const Home = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [mapVisible, setMapVisible] = useState(true);
  const [view, setView] = useState("grid"); // grid | list
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchInstitutes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (userLocation) {
        params.set("userLat", userLocation.lat);
        params.set("userLng", userLocation.lng);
      }
      if (minFees) params.set("minFees", minFees);
      if (maxFees) params.set("maxFees", maxFees);
      if (minRating) params.set("minRating", minRating);

      const res = await API.get(`/institutes?${params.toString()}`);
      let data = res.data.institutes || [];

      // Client-side sort
      if (sortBy === "rating_desc") {
        data = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === "fees_asc") {
        data = [...data].sort((a, b) => (a.fees || 0) - (b.fees || 0));
      } else if (sortBy === "fees_desc") {
        data = [...data].sort((a, b) => (b.fees || 0) - (a.fees || 0));
      } else if (sortBy === "distance_asc" && userLocation) {
        data = [...data].sort((a, b) => (a.distanceInKm || 999) - (b.distanceInKm || 999));
      }

      setInstitutes(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load institutes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, category, userLocation, minFees, maxFees, minRating, sortBy]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser");
      return;
    }
    setLocationError("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError("");
        showToast("📍 Location detected! Showing nearby institutes.");
      },
      () => {
        setLocationError("Unable to retrieve your location. Please allow location access.");
      },
      { timeout: 10000 }
    );
  };

  const clearLocation = () => {
    setUserLocation(null);
    showToast("Location cleared.");
  };

  useEffect(() => { fetchInstitutes(); }, [userLocation, sortBy]);

  const stats = {
    total: institutes.length,
    avgRating: institutes.length
      ? (institutes.reduce((s, i) => s + (i.rating || 0), 0) / institutes.length).toFixed(1)
      : 0,
    categories: [...new Set(institutes.map((i) => i.category))].filter(Boolean).length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      {/* Hero Section */}
      <header className="hero-gradient text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-10">
          {/* Breadcrumb for SEO */}
          <nav aria-label="breadcrumb" className="text-indigo-300 text-xs mb-4">
            <span>Home</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight tracking-tight">
            Find Your Perfect
            <span className="block text-indigo-300">Coaching Institute</span>
          </h1>
          <p className="text-indigo-200 mb-8 text-sm sm:text-base max-w-xl">
            Discover top-rated coaching institutes and educational centers in Noida, Greater Noida & Delhi NCR.
            Filter by subject, fees, rating and distance.
          </p>

          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearch={fetchInstitutes}
            category={category}
            setCategory={setCategory}
            minFees={minFees}
            setMinFees={setMinFees}
            maxFees={maxFees}
            setMaxFees={setMaxFees}
            minRating={minRating}
            setMinRating={setMinRating}
          />

          {/* Stats bar */}
          <div className="flex gap-6 mt-8 pt-6 border-t border-white/10">
            {[
              { label: "Institutes", value: stats.total || "500+" },
              { label: "Avg Rating", value: stats.avgRating > 0 ? `${stats.avgRating}★` : "4.2★" },
              { label: "Categories", value: stats.categories || "9" },
              { label: "Cities", value: "NCR Wide" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-indigo-300 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Location + Map controls */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <button
            onClick={getCurrentLocation}
            className="flex items-center gap-2 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Near Me
          </button>

          {userLocation && (
            <span className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Showing nearby results
              <button onClick={clearLocation} className="text-red-400 hover:text-red-600 ml-1 font-bold" aria-label="Clear location">✕</button>
            </span>
          )}

          {locationError && !userLocation && (
            <p className="text-red-500 text-sm">{locationError}</p>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-2 text-sm transition ${view === "grid" ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                aria-label="Grid view"
              >
                ⊞
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-2 text-sm transition ${view === "list" ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                aria-label="List view"
              >
                ☰
              </button>
            </div>

            <button
              onClick={() => setMapVisible(!mapVisible)}
              className="bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 px-3 py-2 rounded-xl text-sm font-medium transition shadow-sm"
            >
              {mapVisible ? "🗺 Hide Map" : "🗺 Show Map"}
            </button>
          </div>
        </div>

        {/* Map */}
        {mapVisible && (
          <div className="mb-6 fade-in">
            <GoogleMapComponent institutes={institutes} userLocation={userLocation} />
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-700">
            {loading ? (
              <span className="text-gray-400">Searching...</span>
            ) : (
              <>
                <span className="text-indigo-700 font-bold">{institutes.length}</span>{" "}
                {institutes.length === 1 ? "institute" : "institutes"} found
                {userLocation && " near you"}
              </>
            )}
          </h2>
        </div>

        {/* Loading state */}
        {loading && <Loader count={6} />}

        {/* Empty state */}
        {!loading && institutes.length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No institutes found</h3>
            <p className="text-gray-500 text-sm mb-6">Try a different search term or remove some filters.</p>
            <button
              onClick={() => { setSearch(""); setCategory(""); setMinFees(""); setMaxFees(""); setMinRating(""); fetchInstitutes(); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && institutes.length > 0 && (
          <div className={`fade-in ${view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            : "flex flex-col gap-4"
          }`}>
            {institutes.map((institute) => (
              <InstituteCard key={institute._id} institute={institute} />
            ))}
          </div>
        )}
      </main>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Home;
