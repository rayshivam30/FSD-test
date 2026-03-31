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
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

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

  const addImage = () =>
    setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ""] }));

  const removeImage = (index) =>
    setForm((f) => ({
      ...f,
      galleryImages: f.galleryImages.filter((_, i) => i !== index),
    }));

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
          title: "Product created!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#1a1a2e",
          color: "#e8c547",
        });
        navigate("/");
      } else {
        await api.put(`/products/${id}`, payload);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Changes saved!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#1a1a2e",
          color: "#e8c547",
        });
        navigate(`/products/${payload.slug}`);
      }
    } catch (err) {
      const msg =
        err.response?.data?.errors || [
          err.response?.data?.message || "Submission failed",
        ];
      setErrors(Array.isArray(msg) ? msg : [msg]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (fetchLoading) return (
    <div className="pf-page">
      <div className="pf-fetch-loading">
        <div className="pf-fetch-spinner" />
        <p>Loading product…</p>
      </div>
    </div>
  );

  const isEdit = mode === "edit";

  return (
    <div className="pf-page">

      {/* Header */}
      <div className="pf-header">
        <div className="pf-eyebrow">{isEdit ? "Editing product" : "New product"}</div>
        <h1 className="pf-title">
          {isEdit ? "Edit " : "Add "}<em>Product</em>
        </h1>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="pf-errors" role="alert">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} id="product-form" noValidate>
        <div className="pf-grid">

          {/* ── Left column ── */}
          <div className="pf-col">
            <div className="pf-card">
              <div className="pf-card-label">Basic Info</div>

              <div className="pf-field">
                <label htmlFor="pf-metaTitle">Meta Title <span className="pf-req">*</span></label>
                <input
                  id="pf-metaTitle"
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  placeholder="SEO meta title"
                  required
                />
              </div>

              <div className="pf-field">
                <label htmlFor="pf-name">Product Name <span className="pf-req">*</span></label>
                <input
                  id="pf-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product display name"
                  required
                />
              </div>

              <div className="pf-field">
                <label htmlFor="pf-slug">URL Slug <span className="pf-req">*</span></label>
                <div className="pf-slug-wrap">
                  <span className="pf-slug-prefix">/products/</span>
                  <input
                    id="pf-slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="my-product-slug"
                    required
                  />
                </div>
                <span className="pf-hint">Auto-generated from name in create mode</span>
              </div>
            </div>

            {/* Pricing card */}
            <div className="pf-card">
              <div className="pf-card-label">Pricing</div>
              <div className="pf-price-row">
                <div className="pf-field">
                  <label htmlFor="pf-price">Price <span className="pf-req">*</span></label>
                  <div className="pf-input-prefix-wrap">
                    <span className="pf-input-prefix">$</span>
                    <input
                      id="pf-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="pf-field">
                  <label htmlFor="pf-discountedPrice">
                    Discounted Price
                    <span className="pf-optional"> optional</span>
                  </label>
                  <div className="pf-input-prefix-wrap">
                    <span className="pf-input-prefix">$</span>
                    <input
                      id="pf-discountedPrice"
                      name="discountedPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.discountedPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Live discount preview */}
              {form.price && form.discountedPrice &&
                parseFloat(form.discountedPrice) < parseFloat(form.price) && (
                <div className="pf-discount-preview">
                  <span className="pf-discount-pill">
                    {Math.round(
                      (1 - parseFloat(form.discountedPrice) / parseFloat(form.price)) * 100
                    )}% OFF
                  </span>
                  <span className="pf-discount-label">live discount preview</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="pf-col">
            <div className="pf-card pf-card-images">
              <div className="pf-card-label">Gallery Images</div>
              <p className="pf-hint pf-hint-top">Paste image URLs — first image is the cover.</p>

              <div className="pf-image-list">
                {form.galleryImages.map((url, i) => (
                  <div key={i} className="pf-image-row">
                    <div className="pf-image-num">{i + 1}</div>
                    <input
                      id={`pf-image-${i}`}
                      type="url"
                      value={url}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {form.galleryImages.length > 1 && (
                      <button
                        type="button"
                        id={`pf-remove-img-${i}`}
                        className="pf-remove-img"
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                id="pf-add-img-btn"
                className="pf-add-img"
                onClick={addImage}
              >
                + Add another URL
              </button>
            </div>
          </div>
        </div>

        {/* ── Description — full width ── */}
        <div className="pf-card pf-card-desc">
          <div className="pf-card-label">
            Description <span className="pf-req">*</span>
            <span className="pf-hint pf-hint-inline"> Rich text editor</span>
          </div>
          <div className="pf-ckeditor-wrapper">
            <CKEditor
              editor={ClassicEditor}
              data={form.description}
              onChange={(event, editor) => {
                setForm((f) => ({ ...f, description: editor.getData() }));
              }}
              config={{
                toolbar: [
                  "heading", "|",
                  "bold", "italic", "link",
                  "bulletedList", "numberedList", "|",
                  "blockQuote", "undo", "redo",
                ],
              }}
            />
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="pf-actions">
          <button
            type="button"
            id="pf-cancel-btn"
            className="pf-btn-ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            id="pf-submit-btn"
            className="pf-btn-primary"
            disabled={loading}
          >
            {loading
              ? <><span className="pf-spinner" />{isEdit ? "Saving…" : "Creating…"}</>
              : isEdit ? "Save Changes →" : "Create Product →"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;