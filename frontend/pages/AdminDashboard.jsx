import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user?.isAdmin) { navigate("/"); return; }
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/institutes");
      setInstitutes(res.data.institutes || []);
    } catch { showToast("Failed to load data"); }
    finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing permanently?")) return;
    try {
      await API.delete(`/institutes/${id}`);
      setInstitutes((prev) => prev.filter((i) => i._id !== id));
      showToast("✅ Listing deleted.");
    } catch { showToast("❌ Delete failed."); }
  };

  const filtered = institutes.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.city?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: institutes.length,
    categories: [...new Set(institutes.map((i) => i.category))].filter(Boolean).length,
    avgRating: institutes.length
      ? (institutes.reduce((s, i) => s + (i.rating || 0), 0) / institutes.length).toFixed(1)
      : "N/A",
    withFees: institutes.filter((i) => i.fees > 0).length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage all institute listings</p>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-200"
          >
            + Add New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Listings" value={stats.total} icon="🏫" color="bg-indigo-50" />
          <StatCard label="Categories" value={stats.categories} icon="📂" color="bg-amber-50" />
          <StatCard label="Avg Rating" value={`${stats.avgRating}★`} icon="⭐" color="bg-emerald-50" />
          <StatCard label="With Fees" value={stats.withFees} icon="💰" color="bg-rose-50" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">All Listings ({filtered.length})</h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="font-medium">No listings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Institute</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">City</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Rating</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fees</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((inst) => (
                    <tr key={inst._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={inst.image}
                            alt={inst.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(inst.name)}&background=4f46e5&color=ffffff&size=80`; }}
                          />
                          <span className="font-semibold text-gray-900 line-clamp-1 max-w-[160px]">{inst.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {inst.category || "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{inst.city || "—"}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        {inst.rating > 0 ? (
                          <span className="flex items-center gap-1 text-amber-500 font-semibold">
                            ★ {inst.rating}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-indigo-700 font-semibold hidden lg:table-cell">
                        {inst.fees ? `₹${inst.fees.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/institutes/${inst._id}`}
                            className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold hover:underline"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(inst._id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
