import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.errors || [
          err.response?.data?.message || "Login failed",
        ];
      setErrors(Array.isArray(msg) ? msg : [msg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">

      {/* ── Left decorative panel ── */}
      <div className="auth-panel">
        <Link to="/" className="auth-panel-logo">
          Product<span>Hub</span>
        </Link>

        <div className="auth-panel-body">
          <blockquote className="auth-quote">
            "Manage your digital products with precision and speed."
          </blockquote>

          <div className="auth-panel-cards">
            {[
              { emoji: "👟", name: "Air Runner Pro",  price: "₹4,299",  bg: "#fff8e1" },
              { emoji: "🎧", name: "SoundPod Elite",  price: "₹8,999",  bg: "#e8f4fd" },
              { emoji: "📷", name: "LensCraft 4K",    price: "₹24,500", bg: "#fce8e8" },
            ].map((p) => (
              <div className="auth-mini-card" key={p.name}>
                <span className="auth-mini-thumb" style={{ background: p.bg }}>{p.emoji}</span>
                <span className="auth-mini-name">{p.name}</span>
                <span className="auth-mini-price">{p.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-panel-footer">ProductHub · Built for modern commerce</div>
      </div>

      {/* ── Right form side ── */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="auth-eyebrow">Welcome back</div>
          <h1 className="auth-heading">
            Sign in to your<br /><em>dashboard</em>
          </h1>
          <p className="auth-sub">Enter your credentials to continue.</p>

          {errors.length > 0 && (
            <div className="auth-error" role="alert">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit} id="login-form" noValidate>
            <div className="auth-field">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-pass-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-pass-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? <span className="auth-spinner" /> : "Sign In →"}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/signup" id="login-signup-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;