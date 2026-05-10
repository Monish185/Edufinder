import { useState, useRef, useEffect } from "react";

const categories = ["Engineering", "Medical", "Commerce", "Arts", "Science", "Law", "Management", "Coaching", "Programming","CUET","School Tuition","SSC","GATE","CAT","UPSC","JEE","NEET","JEE/NEET","Other"];


const categoryIcons = {
  Engineering: "⚙️", Medical: "🏥", Commerce: "📊", Arts: "🎨",
  Science: "🔬", Law: "⚖️", Management: "💼", Coaching: "📚", Other: "🏫",
};

const SearchBar = ({ search, setSearch, onSearch, category, setCategory, minFees, setMinFees, maxFees, setMaxFees, minRating, setMinRating }) => {
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const activeFiltersCount = [
    category && category !== "" ? 1 : 0,
    minFees ? 1 : 0,
    maxFees ? 1 : 0,
    minRating ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () => {
    setSearch("");
    setCategory("");
    if (setMinFees) setMinFees("");
    if (setMaxFees) setMaxFees("");
    if (setMinRating) setMinRating("");
    onSearch();
  };

  return (
    <div className="space-y-3">
      {/* Main search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search institute name, city, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 text-sm transition"
            aria-label="Search institutes"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${
            showFilters || activeFiltersCount > 0
              ? "bg-white text-indigo-700 border-white"
              : "bg-white/15 text-white border-white/30 hover:bg-white/25"
          }`}
          aria-label="Toggle filters"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-black text-xs font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <button
          onClick={onSearch}
          className="bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-3 rounded-xl text-sm font-bold transition shadow-lg"
          aria-label="Search"
        >
          Search
        </button>
      </div>

      {/* Category quick filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const val = cat === "All" ? "" : cat;
          const active = category === val;
          return (
            <button
              key={cat}
              onClick={() => { setCategory(val); onSearch(); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                active
                  ? "bg-white text-indigo-700 shadow-md"
                  : "bg-white/15 text-white/80 hover:bg-white/25 border border-white/20"
              }`}
            >
              {cat !== "All" && <span>{categoryIcons[cat]}</span>}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-sm font-semibold">Advanced Filters</p>
            {activeFiltersCount > 0 && (
              <button onClick={clearAll} className="text-indigo-200 hover:text-white text-xs underline">
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-indigo-200 text-xs font-medium block mb-1">Min Fees (₹)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={minFees || ""}
                onChange={(e) => setMinFees && setMinFees(e.target.value)}
                className="w-full bg-white/15 border border-white/30 text-white placeholder-indigo-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            </div>
            <div>
              <label className="text-indigo-200 text-xs font-medium block mb-1">Max Fees (₹)</label>
              <input
                type="number"
                placeholder="e.g. 100000"
                value={maxFees || ""}
                onChange={(e) => setMaxFees && setMaxFees(e.target.value)}
                className="w-full bg-white/15 border border-white/30 text-white placeholder-indigo-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            </div>
            <div>
              <label className="text-indigo-200 text-xs font-medium block mb-1">Min Rating</label>
              <select
                value={minRating || ""}
                onChange={(e) => setMinRating && setMinRating(e.target.value)}
                className="w-full bg-white/15 border border-white/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
              >
                <option value="">Any</option>
                <option value="3">3+ ★</option>
                <option value="3.5">3.5+ ★</option>
                <option value="4">4+ ★</option>
                <option value="4.5">4.5+ ★</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={onSearch}
                className="w-full bg-white text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
