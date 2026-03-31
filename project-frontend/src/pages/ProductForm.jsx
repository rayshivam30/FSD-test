import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import api from "../api/axios";
import Swal from "sweetalert2";
import "./ProductForm.css";

const emptyForm = {
  metaTitle: "",
  name: "",
  slug: "",
  galleryImages: [""],
  price: "",
  discountedPrice: "",
  description: "",
};

const ProductForm = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(mode === "edit");


  const generateSlug = (name) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  // Load product for editing
  useEffect(() => {
    if (mode !== "edit" || !id) return;
    const load = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data.data;
        setForm({
          metaTitle: p.metaTitle,
          name: p.name,
          slug: p.slug,
          galleryImages: p.galleryImages.length ? p.galleryImages : [""],
          price: String(p.price),
          discountedPrice: p.discountedPrice ? String(p.discountedPrice) : "",
          description: p.description,
        });
      } catch {
        setErrors(["Failed to load product data."]);
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === "name" && mode === "create") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleImageChange = (index, value) => {
    setForm((f) => {
      const imgs = [...f.galleryImages];
      imgs[index] = value;
      return { ...f, galleryImages: imgs };
    });
  };

  const addImage = () => setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ""] }));
  const removeImage = (index) =>
    setForm((f) => ({ ...f, galleryImages: f.galleryImages.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const payload = {
      ...form,
      galleryImages: form.galleryImages.filter((u) => u.trim() !== ""),
      price: parseFloat(form.price),
      discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : null,
    };

    try {
      if (mode === "create") {
        await api.post("/products", payload);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Product created successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#ffffff",
          color: "#0f172a",
          borderRadius: "12px"
        });
        navigate("/");
      } else {
        await api.put(`/products/${id}`, payload);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Product updated successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#ffffff",
          color: "#0f172a",
          borderRadius: "12px"
        });
        navigate(`/products/${payload.slug}`)
      }
    } catch (err) {
      const msg = err.response?.data?.errors || [err.response?.data?.message || "Submission failed"];
      setErrors(Array.isArray(msg) ? msg : [msg]);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="pf-loading">Loading product…</div>;

  return (
    <div className="pf-page">
      <h1 className="pf-title">{mode === "create" ? "Add New Product" : "Edit Product"}</h1>

      {errors.length > 0 && (
        <div className="pf-errors" role="alert">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="pf-form" id="product-form">
        <div className="pf-grid">
          {/* Left column */}
          <div className="pf-col">
            <div className="form-group">
              <label htmlFor="pf-metaTitle">Meta Title *</label>
              <input id="pf-metaTitle" name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="SEO meta title" required />
            </div>
            <div className="form-group">
              <label htmlFor="pf-name">Product Name *</label>
              <input id="pf-name" name="name" value={form.name} onChange={handleChange} placeholder="Product display name" required />
            </div>
            <div className="form-group">
              <label htmlFor="pf-slug">URL Slug *</label>
              <input id="pf-slug" name="slug" value={form.slug} onChange={handleChange} placeholder="my-product-slug" required />
              <span className="form-hint">Auto-generated from name, lowercase with hyphens</span>
            </div>
            <div className="pf-prices">
              <div className="form-group">
                <label htmlFor="pf-price">Price * ($)</label>
                <input id="pf-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div className="form-group">
                <label htmlFor="pf-discountedPrice">Discounted Price ($)</label>
                <input id="pf-discountedPrice" name="discountedPrice" type="number" min="0" step="0.01" value={form.discountedPrice} onChange={handleChange} placeholder="0.00 (optional)" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="pf-col">
            <div className="form-group">
              <label>Gallery Images * <span className="form-hint">(URLs)</span></label>
              {form.galleryImages.map((url, i) => (
                <div key={i} className="pf-image-row">
                  <input
                    id={`pf-image-${i}`}
                    type="url"
                    value={url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.galleryImages.length > 1 && (
                    <button type="button" id={`pf-remove-img-${i}`} className="pf-remove-img" onClick={() => removeImage(i)} aria-label="Remove">✕</button>
                  )}
                </div>
              ))}
              <button type="button" id="pf-add-img-btn" className="pf-add-img" onClick={addImage}>+ Add Image URL</button>
            </div>
          </div>
        </div>

        {/* Description - Full width */}
        <div className="form-group pf-description">
          <label>Description * <span className="form-hint">(Rich text editor)</span></label>
          <div className="pf-ckeditor-wrapper">
            <CKEditor
              editor={ClassicEditor}
              data={form.description}
              onChange={(event, editor) => {
                setForm((f) => ({ ...f, description: editor.getData() }));
              }}
              config={{
                toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "blockQuote", "undo", "redo"],
              }}
            />
          </div>
        </div>

        <div className="pf-actions">
          <button type="button" id="pf-cancel-btn" className="pf-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" id="pf-submit-btn" className="btn-primary pf-btn-submit" disabled={loading}>
            {loading ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create Product" : "Save Changes")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
