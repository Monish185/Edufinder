import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { useState, useEffect, useRef } from "react";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    try { await API.post("/auth/logout"); } catch (_) {}
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const navLink = (path, label) => (
    <Link
      to={path}
      className={`relative text-sm font-medium transition-colors px-1 pb-0.5 ${
        isActive(path)
          ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-400 after:rounded"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950 shadow-xl shadow-black/20"
          : "bg-gray-900"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          aria-label="EduFinder Home"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <span className="text-white text-base font-bold leading-none">E</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Edu<span className="text-indigo-400">Finder</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLink("/", "Home")}
          {user && navLink("/favorites", "❤ Saved")}
           {user?.isAdmin && navLink("/create", "Add Listing")}
          {user?.isAdmin && navLink("/admin", "Dashboard")}

          {user?.subscriptionStatus !== "active" ? (
            <Link
              to="/subscribe"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-full text-sm font-semibold transition shadow-lg shadow-amber-900/30"
            >
              <span>⭐</span> Upgrade
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
              ✓ {user.subscriptionPlan?.toUpperCase()}
            </span>
          )}
        </div>

        {/* User area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-gray-200 text-sm font-medium max-w-[100px] truncate">
                  {user.name?.split(" ")[0]}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 fade-in" role="menu">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/favorites" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">
                    <span>❤️</span> My Favorites
                  </Link>
                  {user.isAdmin && (
                    <Link to="/create" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">
                      <span>➕</span> Add Institute
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-900/30"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden w-9 h-9 flex items-center justify-center text-white rounded-lg hover:bg-gray-800 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 px-4 py-4 space-y-1 fade-in">
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-gray-800 rounded-xl">
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 text-gray-200 hover:bg-gray-800 rounded-xl text-sm font-medium">
            🏠 Home
          </Link>

          {user && (
            <Link to="/favorites" className="flex items-center gap-2 px-3 py-2.5 text-gray-200 hover:bg-gray-800 rounded-xl text-sm font-medium">
              ❤️ My Favorites
            </Link>
          )}

          {user?.isAdmin && (
            <Link to="/create" className="flex items-center gap-2 px-3 py-2.5 text-gray-200 hover:bg-gray-800 rounded-xl text-sm font-medium">
              ➕ Add Listing
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 px-3 py-2.5 text-gray-200 hover:bg-gray-800 rounded-xl text-sm font-medium">
              ⚙️ Admin Dashboard
            </Link>
          )}

          {user?.subscriptionStatus !== "active" ? (
            <Link to="/subscribe" className="flex items-center gap-2 px-3 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-semibold mx-0">
              ⭐ Upgrade Plan
            </Link>
          ) : (
            <div className="px-3 py-2.5 bg-emerald-900/30 text-emerald-400 rounded-xl text-sm font-semibold">
              ✓ {user.subscriptionPlan?.toUpperCase()} Plan Active
            </div>
          )}

          <div className="border-t border-gray-800 pt-3 mt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-red-400 hover:bg-gray-800 rounded-xl text-sm font-medium"
              >
                🚪 Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="px-3 py-2.5 text-gray-200 hover:bg-gray-800 rounded-xl text-sm font-medium text-center">
                  Sign In
                </Link>
                <Link to="/register" className="px-3 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold text-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
