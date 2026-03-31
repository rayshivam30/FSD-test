import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* Initials avatar from username */
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <nav className="nb-nav">
      {/* Brand */}
      <Link to="/" id="nav-brand-link" className="nb-logo">
        Product<span>Hub</span>
      </Link>

      {/* Right side */}
      <div className="nb-right">
        {isAuthenticated ? (
          <>
            {/* Avatar + username */}
            <div className="nb-user">
              <div className="nb-avatar">{initials}</div>
              <span className="nb-username">{user?.username}</span>
            </div>

            {/* Divider */}
            <div className="nb-divider" />

            {/* Logout */}
            <button
              id="nav-logout-btn"
              className="nb-btn-ghost"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </>
        ) : (
          !isAuthPage && (
            <>
              <Link to="/login" id="nav-login-link" className="nb-link">
                Login
              </Link>
              <Link to="/signup" id="nav-signup-link" className="nb-btn-primary">
                Get Started
              </Link>
            </>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;