import { useEffect, useRef, useState } from "react";
import { searchProducts, fmt } from "../data/catalog";

export default function SearchOverlay({ open, products, onClose, onPickResult }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const results = searchProducts(products, query).slice(0, 8);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>×</button>
        </div>
        {query.trim() && (
          <div className="search-results">
            {results.length === 0 ? (
              <div className="search-empty">No products found for "{query}".</div>
            ) : (
              results.map((p) => (
                <button
                  key={p.id}
                  className="search-result"
                  onClick={() => onPickResult(p)}
                >
                  <img src={p.img} alt={p.name} />
                  <div className="search-result-info">
                    <div className="search-result-name">{p.name}</div>
                    <div className="search-result-meta">{p.label} · {fmt(p.price)}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
