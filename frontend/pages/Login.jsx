import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", { credential: credentialResponse.credential });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)" }}>
      {/* Left panel - decorative */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 60%, #7c3aed 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-400/10 blur-3xl" />
        </div>
        <div className="relative text-center text-white max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6" aria-hidden="true">
            <span className="text-3xl font-extrabold">E</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-3" style={{ fontFamily: "'Fraunces', serif" }}>EduFinder</h2>
          <p className="text-indigo-200 text-base leading-relaxed">
            Discover top coaching institutes and educational centers across Noida & Delhi NCR.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {["500+ Institutes", "15+ Cities", "4.2★ Avg Rating", "10K+ Students"].map((stat) => (
              <div key={stat} className="bg-white/8 border border-white/15 rounded-xl p-3 text-center">
                <span className="text-white font-semibold text-sm">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-7">
              <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden" aria-label="Go to home">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center" aria-hidden="true">
                  <span className="text-white text-sm font-bold">E</span>
                </div>
                <span className="font-extrabold text-gray-900">EduFinder</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to continue to EduFinder</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-start gap-2" role="alert">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1.5 block">Email address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white px-4 py-3 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold transition-all shadow-sm shadow-indigo-200 hover:shadow-indigo-300 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            <div className="relative flex items-center gap-3 text-gray-400 text-xs my-5">
              <div className="flex-1 border-t border-gray-100" />
              <span className="font-medium">or continue with</span>
              <div className="flex-1 border-t border-gray-100" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-in Failed")}
                theme="outline"
                size="large"
                shape="pill"
              />
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
