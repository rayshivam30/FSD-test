import { useState } from "react";
import "./ImageSlider.css";

const ImageSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return <div className="slider-placeholder">No images available</div>;
  }

  return (
    <div className="slider-container">
      {/* Main Image */}
      <div className="slider-main">
        <img
          id={`slider-main-img`}
          src={images[current]}
          alt={`Product image ${current + 1}`}
          className="slider-main-img"
          onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found"; }}
        />
        {images.length > 1 && (
          <>
            <button
              id="slider-prev-btn"
              className="slider-arrow slider-arrow-left"
              onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
              aria-label="Previous image"
            >‹</button>
            <button
              id="slider-next-btn"
              className="slider-arrow slider-arrow-right"
              onClick={() => setCurrent((c) => (c + 1) % images.length)}
              aria-label="Next image"
            >›</button>
          </>
        )}
        <div className="slider-badge">{current + 1} / {images.length}</div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="slider-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              id={`slider-thumb-${i}`}
              className={`slider-thumb ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onError={(e) => { e.target.src = "https://via.placeholder.com/80x60?text=?"; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
