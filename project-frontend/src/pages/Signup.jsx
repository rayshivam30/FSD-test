import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Auth.css";

const Signup = () => {
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
      const res = await api.post("/auth/signup", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.errors || [
          err.response?.data?.message || "Signup failed",
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
            "Your catalog, beautifully in control."
          </blockquote>

          <ul className="auth-perks">
            {[
              "Full CRUD product management",
              "JWT-secured authentication",
              "Rich text editor for descriptions",
              "Image gallery with slider",
              "Real-time data sync",
            ].map((perk) => (
              <li key={perk}>
                <span className="auth-perk-dot" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-panel-footer">ProductHub · Built for modern commerce</div>
      </div>

      {/* ── Right form side ── */}
      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="auth-eyebrow">Get started free</div>
          <h1 className="auth-heading">
            Create your<br /><em>account</em>
          </h1>
          <p className="auth-sub">Join ProductHub and take control of your catalog.</p>

          {errors.length > 0 && (
            <div className="auth-error" role="alert">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit} id="signup-form" noValidate>
            <div className="auth-field">
              <label htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username (alphanumeric)"
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <div className="auth-pass-wrap">
                <input
                  id="signup-password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                  minLength={6}
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
              id="signup-submit-btn"
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? <span className="auth-spinner" /> : "Create Account →"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" id="signup-login-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;