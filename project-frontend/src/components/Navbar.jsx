import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" id="nav-brand-link">🛍️ ProductHub</Link>
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span className="nav-user">👤 {user?.username}</span>
            <button id="nav-logout-btn" className="btn-outline-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          !isAuthPage && (
            <>
              <Link to="/login" id="nav-login-link">Login</Link>
              <Link to="/signup" id="nav-signup-link" className="btn-primary-sm">Sign Up</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
