import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const FEATURES = [
  { icon: "📊", label: "Real-time analytics & charts" },
  { icon: "🎯", label: "Smart budget tracking & alerts" },
  { icon: "🏆", label: "Category-wise spending insights" },
  { icon: "🔒", label: "Secure JWT authentication" },
];

// SVG Icons
const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2.003 5.884 10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z" />
    <path d="m18 8.118-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1zm3 8V5.5a3 3 0 1 0-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4" style={{ position: "relative", zIndex: 1 }}>
      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="w-full max-w-4xl auth-card rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Left Branding Panel ── */}
        <div className="hidden md:flex md:w-5/12 flex-col justify-between p-10 auth-panel" style={{ position: "relative", zIndex: 1 }}>
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                💳
              </div>
              <div>
                <span className="text-xl font-bold text-white block leading-none">SmartSpend</span>
                <span className="text-xs text-blue-300/60">Expense Intelligence</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white leading-snug mb-3">
              Take control of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                your finances
              </span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Track every rupee, analyze your spending habits, and smash your savings goals — all in one place.
            </p>

            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <div
                  key={f.label}
                  className="feature-item slide-in-left"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="feature-icon">{f.icon}</div>
                  <span className="text-sm text-gray-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-8">SmartSpend © 2026 · Built with ❤️</p>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">💳</div>
            <span className="text-lg font-bold text-white">SmartSpend</span>
          </div>

          <div className="slide-up">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back 👋</h2>
            <p className="text-gray-400 text-sm mb-8">Sign in to continue to your dashboard</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 fade-in flex items-center gap-2 shake">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-9a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block tracking-wide uppercase">
                  Email Address
                </label>
                <div className="auth-input-wrap">
                  <MailIcon />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="auth-input-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block tracking-wide uppercase">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <LockIcon />
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="auth-input-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-btn w-full mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Create one free →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
