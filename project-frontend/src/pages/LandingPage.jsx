import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">✨ The Ultimate E-Commerce Hub</div>
          <h1 className="hero-title">
            Manage your digital products with <span className="text-gradient">precision</span> and <span className="text-gradient">speed</span>.
          </h1>
          <p className="hero-description">
            Experience next-generation inventory management. ProductHub gives you complete control over your catalog with rich text descriptions, high-performance image sliders, and seamless data synchronization.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary hero-btn">
              Get Started Free <span className="arrow">→</span>
            </Link>
            <Link to="/login" className="btn-outline hero-btn">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-section">
        <h2 className="section-title">Built for Modern Businesses</h2>
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon">🛡️</div>
            <h3>Bank-Grade Security</h3>
            <p>Your product data is safeguarded with robust JWT authentication and cutting-edge encryption standards.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Engineered for maximum speed with an optimized backend stack, delivering completely instant page loads.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🎨</div>
            <h3>Rich Descriptions</h3>
            <p>Present your catalog beautifully using our fully integrated rich-text CKEditor support.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
