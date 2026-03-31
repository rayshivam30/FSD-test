import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ImageSlider from "../components/ImageSlider";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data.data);
      } catch {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${product.id}`);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const formatPrice = (p) => `$${parseFloat(p).toFixed(2)}`;

  if (loading) return (
    <div className="pd-page">
      <div className="pd-skeleton-header" />
      <div className="pd-skeleton-body" />
    </div>
  );

  if (error) return (
    <div className="pd-page pd-error">
      <div className="pd-error-icon">⚠️</div>
      <p>{error}</p>
      <Link to="/" id="pd-back-home-link">← Back to products</Link>
    </div>
  );

  return (
    <div className="pd-page">
      <Link to="/" id="pd-back-link" className="pd-back">← All Products</Link>

      <div className="pd-layout">
        <div className="pd-images">
          <ImageSlider images={product.galleryImages || []} />
        </div>

        <div className="pd-info">
          <span className="pd-meta-title">{product.metaTitle}</span>
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-slug">
            <span>Slug:</span> <code id="pd-slug-code">{product.slug}</code>
          </p>

          <div className="pd-prices">
            {product.discountedPrice ? (
              <>
                <span className="pd-price-discounted">{formatPrice(product.discountedPrice)}</span>
                <span className="pd-price-original">{formatPrice(product.price)}</span>
                <span className="pd-discount-badge">
                  {Math.round((1 - parseFloat(product.discountedPrice) / parseFloat(product.price)) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="pd-price-regular">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="pd-divider" />

          <div className="pd-description">
            <h3>Description</h3>
            <div
              id="pd-description-content"
              className="pd-desc-content"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <div className="pd-dates">
            <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
          </div>

          {isAuthenticated && (
            <div className="pd-actions">
              <Link to={`/products/${product.id}/edit`} id="pd-edit-link" className="pd-btn-edit">
                ✏️ Edit Product
              </Link>
              <button id="pd-delete-btn" className="pd-btn-delete" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
