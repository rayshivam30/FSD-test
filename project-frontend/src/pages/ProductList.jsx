import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./ProductList.css";

const ProductList = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: { search: query, page, limit: 9 } });
      setProducts(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Live search filtering with 500ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setQuery(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      color: "#0f172a",
      backdrop: `rgba(15, 23, 42, 0.4)`,
      borderRadius: "16px"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        Swal.fire({
          title: "Deleted!",
          text: "The product has been removed.",
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 1500,
          showConfirmButton: false,
          borderRadius: "16px"
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#2563eb",
          borderRadius: "16px"
        });
      }
    }
  };

  const formatPrice = (p) => `$${parseFloat(p).toFixed(2)}`;

  const stripHtml = (htmlString) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="product-list-page">
      <div className="pl-header">
        <div>
          <h1 className="pl-title">Product Catalog</h1>
          <p className="pl-count">{meta.total ?? 0} products found</p>
        </div>
        {isAuthenticated && (
          <Link to="/products/new" id="pl-add-btn" className="add-btn">+ Add Product</Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="pl-search-form" id="pl-search-form">
        <input
          id="pl-search-input"
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button id="pl-search-btn" type="submit">Search</button>
        {query && (
          <button id="pl-clear-btn" type="button" onClick={() => { setSearch(""); setQuery(""); setPage(1); }}>
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div className="pl-loading">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="pl-empty">
          <div className="pl-empty-icon">📦</div>
          <p className="pl-empty-text">No products found{query ? ` for "${query}"` : ""}.</p>
          {isAuthenticated && <Link to="/products/new" id="pl-empty-add-link">Add the first one</Link>}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-card-image">
                {p.discountedPrice && (
                  <div className="product-card-discount-badge">
                    <span className="discount-icon">↓</span>
                    {Math.round((1 - parseFloat(p.discountedPrice) / parseFloat(p.price)) * 100)}% OFF
                  </div>
                )}
                {p.galleryImages?.[0] ? (
                  <img
                    src={p.galleryImages[0]}
                    alt={p.name}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                  />
                ) : (
                  <div className="product-card-no-img">🖼️</div>
                )}
              </div>
              <div className="product-card-body">
                <span className="product-card-meta">{p.metaTitle}</span>
                <h2 className="product-card-name">{p.name}</h2>
                <div className="product-card-prices">
                  {p.discountedPrice ? (
                    <>
                      <span className="price-discounted">{formatPrice(p.discountedPrice)}</span>
                      <span className="price-original">{formatPrice(p.price)}</span>
                    </>
                  ) : (
                    <span className="price-regular">{formatPrice(p.price)}</span>
                  )}
                </div>
                <p className="product-card-desc">
                  {stripHtml(p.description).substring(0, 80)}…
                </p>
                <div className="product-card-actions">
                  <Link to={`/products/${p.slug}`} id={`pc-view-${p.id}`} className="btn-view">View</Link>
                  {isAuthenticated && (
                    <>
                      <Link to={`/products/${p.id}/edit`} id={`pc-edit-${p.id}`} className="btn-edit">Edit</Link>
                      <button id={`pc-delete-${p.id}`} className="btn-delete" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="pl-pagination">
          <button id="pl-prev-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span className="pl-page-info">Page {page} of {meta.totalPages}</span>
          <button id="pl-next-btn" disabled={page === meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
