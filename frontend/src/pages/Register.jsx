import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const STEPS = [
  { icon: "1️⃣", label: "Create your free account" },
  { icon: "2️⃣", label: "Set your monthly budget" },
  { icon: "3️⃣", label: "Track expenses daily" },
  { icon: "4️⃣", label: "Watch your savings grow" },
];

// SVG Icons
const UserIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003z" />
  </svg>
);

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

export default function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4" style={{ position: "relative", zIndex: 1 }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="w-full max-w-4xl auth-card rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Left Branding Panel ── */}
        <div className="hidden md:flex md:w-5/12 flex-col justify-between p-10 auth-panel" style={{ position: "relative", zIndex: 1 }}>
          <div>
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
              Start your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                financial journey
              </span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Join thousands of users who have mastered their finances with SmartSpend.
            </p>

            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.label}
                  className="feature-item slide-in-left"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="feature-icon">{s.icon}</div>
                  <span className="text-sm text-gray-300">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-8">SmartSpend © 2026 · Free forever</p>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">💳</div>
            <span className="text-lg font-bold text-white">SmartSpend</span>
          </div>

          <div className="slide-up">
            <h2 className="text-2xl font-bold text-white mb-1">Create account ✨</h2>
            <p className="text-gray-400 text-sm mb-8">Free forever. No credit card required.</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 fade-in flex items-center gap-2 shake">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-9a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block tracking-wide uppercase">
                  Full Name
                </label>
                <div className="auth-input-wrap">
                  <UserIcon />
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Your full name"
                    className="auth-input-inner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block tracking-wide uppercase">
                  Email Address
                </label>
                <div className="auth-input-wrap">
                  <MailIcon />
                  <input
                    id="reg-email"
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
                    id="reg-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    className="auth-input-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-btn w-full mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
