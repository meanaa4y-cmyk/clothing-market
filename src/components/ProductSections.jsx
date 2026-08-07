import { PANELS, fmt } from "../data/catalog";

export function PanelStrip({ onFilterLink }) {
  return (
    <>
      <div className="three-ways">
        <span className="eyebrow">The Collection</span>
        <h2>Three Ways to Wear Elegance</h2>
      </div>
      <div className="panel-strip">
        {PANELS.map((p) => (
          <div className="panel-item" key={p.label}>
            <img src={p.img} alt={p.label} />
            <div className="panel-label">
              <div>{p.label}</div>
              <a
                href="#products"
                className="link-underline"
                style={{ color: "white" }}
                onClick={(e) => { e.preventDefault(); onFilterLink(p.filter, p.label); }}
              >
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const CAT_BUTTONS = [
  { filter: "all", label: "All" },
  { filter: "unstitched", label: "Unstitched" },
  { filter: "ready", label: "Ready to Wear" },
  { filter: "luxury", label: "Luxury Pret" },
  { filter: "men", label: "Men" },
  { filter: "accessories", label: "Accessories" },
];

export function CatStrip({ current, onSelect }) {
  return (
    <div className="cat-strip">
      {CAT_BUTTONS.map((b) => (
        <button
          key={b.filter}
          className={current === b.filter ? "active" : ""}
          onClick={() => onSelect(b.filter)}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

export function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="grid" id="productGrid">
      {products.map((p) => (
        <div className="card" key={p.id}>
          <div className="card-img">
            <img src={p.img} alt={p.name} loading="lazy" />
            {p.oldPrice && <span className="sale-tag">Sale</span>}
            {p.isNew && <span className="new-tag">New In</span>}
            <button className="quick-add" onClick={() => onAddToCart(p.id)}>Add to Cart</button>
          </div>
          <div className="card-info">
            <div className="card-cat">{p.label}</div>
            <div className="card-title">{p.name}</div>
            <div className="price-row">
              {p.oldPrice && <span className="price-old">{fmt(p.oldPrice)}</span>}
              <span className="price-new">{fmt(p.price)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
