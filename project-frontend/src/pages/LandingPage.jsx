import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="lp-root">

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-left">
          <div className="lp-hero-tag">Product Management Platform</div>
          <h1 className="lp-h1">
            Your catalog,<br />
            <em>beautifully</em><br />
            in control.
          </h1>
          <p className="lp-hero-desc">
            A full-stack product management system built for modern e-commerce — with rich editing, smart validation, and real-time sync.
          </p>
          <div className="lp-hero-actions">
            <Link to="/signup" className="lp-btn-primary">Start for free →</Link>
            <Link to="/login" className="lp-btn-ghost">Sign in ↗</Link>
          </div>
        </div>

        <div className="lp-hero-visual">
          <div className="lp-dashboard-card">
            <div className="lp-db-header">
              <div className="lp-db-title">Product Catalog</div>
              <div className="lp-db-badge">● Live</div>
            </div>
            {[
              { emoji: "👟", bg: "#fff8e1", name: "Air Runner Pro", slug: "/products/air-runner-pro", price: "₹4,299" },
              { emoji: "🎧", bg: "#e8f4fd", name: "SoundPod Elite", slug: "/products/soundpod-elite", price: "₹8,999" },
              { emoji: "📷", bg: "#fce8e8", name: "LensCraft 4K", slug: "/products/lenscraft-4k", price: "₹24,500" },
            ].map((p) => (
              <div className="lp-product-row" key={p.name}>
                <div className="lp-p-thumb" style={{ background: p.bg }}>{p.emoji}</div>
                <div className="lp-p-info">
                  <div className="lp-p-name">{p.name}</div>
                  <div className="lp-p-slug">{p.slug}</div>
                </div>
                <div className="lp-p-price">{p.price}</div>
              </div>
            ))}
          </div>
          <div className="lp-floating-card">
            <div className="lp-fc-number">142</div>
            <div className="lp-fc-label">Products managed</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="lp-marquee-section">
        <div className="lp-marquee-track">
          {[
            "JWT Authentication", "CKEditor Rich Text", "Image Sliders",
            "CRUD Operations", "Helmet.js Security", "React Router",
            "Express.js Backend", "MongoDB Storage",
            "JWT Authentication", "CKEditor Rich Text", "Image Sliders",
            "CRUD Operations", "Helmet.js Security", "React Router",
            "Express.js Backend", "MongoDB Storage",
          ].map((item, i) => (
            <span key={i} className={i % 2 === 1 ? "lp-marquee-dot" : ""}>{i % 2 === 1 ? "·" : item}</span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="lp-features" id="features">
        <div className="lp-section-eyebrow">Why ProductHub</div>
        <div className="lp-section-heading">Everything you need to ship faster.</div>
        <div className="lp-features-grid">
          {[
            { icon: "🛡️", bg: "#fff8e1", title: "JWT Authentication", desc: "Secure login and signup flow with token-based auth, bcrypt hashing, and protected API routes.", dark: false },
            { icon: "✍️", bg: "rgba(255,255,255,0.12)", title: "Rich Text Editing", desc: "CKEditor integration for product descriptions — bold, lists, links, and full HTML output out of the box.", dark: true },
            { icon: "🖼️", bg: "#e8f4fd", title: "Image Slider", desc: "Gallery with clickable thumbnails that update the main product image. Clean and fully responsive.", dark: false },
            { icon: "✅", bg: "#e8f5e9", title: "Smart Validation", desc: "Fields like slug, price, meta title validated on both frontend and backend using Joi / express-validator.", dark: false },
            { icon: "⚡", bg: "#fff8e1", title: "Full CRUD API", desc: "Create, read, update, delete products via clean REST endpoints — all wired to your React UI.", dark: false },
            { icon: "📱", bg: "#e8f4fd", title: "Fully Responsive", desc: "Built with MUI / Shadcn components for accessibility and smooth experience across all devices.", dark: false },
          ].map((f) => (
            <div className={`lp-feature-card${f.dark ? " lp-feature-dark" : ""}`} key={f.title}>
              <div className="lp-f-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div className="lp-f-title">{f.title}</div>
              <div className="lp-f-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="lp-stats">
        <div className="lp-stats-inner">
          <div className="lp-stats-text">
            <h2>Built on a solid foundation.</h2>
            <p>Every part of the stack is chosen for reliability, security, and developer experience.</p>
          </div>
          <div className="lp-stats-grid">
            {[
              { num: "100%", label: "Validated inputs" },
              { num: "JWT", label: "Secure auth flow" },
              { num: "REST", label: "API architecture" },
            ].map((s) => (
              <div className="lp-stat-item" key={s.label}>
                <div className="lp-stat-num">{s.num}</div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-box">
          <h2>Ready to manage your products the right way?</h2>
          <div className="lp-cta-actions">
            <Link to="/signup" className="lp-btn-dark">Create free account →</Link>
            <div className="lp-cta-sub">No credit card needed</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">Product<span>Hub</span></div>
        <div className="lp-footer-text">Built with Node.js · React · MongoDB</div>
      </footer>

    </div>
  );
};

export default LandingPage;