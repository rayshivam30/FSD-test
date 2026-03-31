import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ImageSlider from "../components/ImageSlider";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
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
    fetchProduct();
  }, [slug]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this product. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c9302c",
      cancelButtonColor: "#1a1a2e",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      color: "#1a1a2e",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "rounded-md",
        cancelButton: "rounded-md"
      }
    });

    if (result.isConfirmed) {
      setDeleting(true);
      try {
        await api.delete(`/products/${product.id}`);
        
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product successfully removed.",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end"
        });

        navigate("/");
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: err.response?.data?.message || "Something went wrong while deleting."
        });
        setDeleting(false);
      }
    }
  };

  const formatPrice = (p) => `$${parseFloat(p).toFixed(2)}`;

  const discount = product?.discountedPrice
    ? Math.round((1 - parseFloat(product.discountedPrice) / parseFloat(product.price)) * 100)
    : null;

  /* ── Loading ── */
  if (loading) return (
    <div className="pd-page">
      <div className="pd-skeleton-back" />
      <div className="pd-layout">
        <div className="pd-skeleton-img" />
        <div className="pd-skeleton-info">
          <div className="pd-skel pd-skel-sm" />
          <div className="pd-skel pd-skel-lg" />
          <div className="pd-skel pd-skel-md" />
          <div className="pd-skel pd-skel-md" />
          <div className="pd-skel pd-skel-sm" />
        </div>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="pd-page pd-error-page">
      <div className="pd-error-box">
        <div className="pd-error-num">404</div>
        <p className="pd-error-msg">{error}</p>
        <Link to="/" id="pd-back-home-link" className="pd-btn-primary">
          ← Back to products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="pd-page">

      {/* Back */}
      <Link to="/" id="pd-back-link" className="pd-back">
        ← All Products
      </Link>

      <div className="pd-layout">

        {/* ── Images ── */}
        <div className="pd-images">
          <ImageSlider images={product.galleryImages || []} />
        </div>

        {/* ── Info ── */}
        <div className="pd-info">

          {/* Meta title + discount badge */}
          <div className="pd-top-row">
            <span className="pd-meta-title">{product.metaTitle}</span>
            {discount && (
              <span className="pd-discount-badge">{discount}% OFF</span>
            )}
          </div>

          {/* Product name */}
          <h1 className="pd-name">{product.name}</h1>

          {/* Slug */}
          <p className="pd-slug-row">
            <span className="pd-slug-label">slug</span>
            <code id="pd-slug-code" className="pd-slug-code">{product.slug}</code>
          </p>

          {/* Prices */}
          <div className="pd-prices">
            {product.discountedPrice ? (
              <>
                <span className="pd-price-now">{formatPrice(product.discountedPrice)}</span>
                <span className="pd-price-was">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="pd-price-now">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="pd-divider" />

          {/* Description */}
          <div className="pd-description">
            <div className="pd-desc-label">Description</div>
            <div
              id="pd-description-content"
              className="pd-desc-content"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {/* Dates */}
          <div className="pd-dates">
            <span>Added {new Date(product.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="pd-dates-dot">·</span>
            <span>Updated {new Date(product.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>

          {/* Actions */}
          {isAuthenticated && (
            <div className="pd-actions">
              <Link
                to={`/products/${product.id}/edit`}
                id="pd-edit-link"
                className="pd-btn-primary"
              >
                Edit Product
              </Link>

              <button
                id="pd-delete-btn"
                className="pd-btn-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <span className="pd-spinner" /> : "Delete Product"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;