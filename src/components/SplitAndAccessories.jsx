export function SplitBanner({ onFilterLink }) {
  return (
    <>
      <div className="step-fresh">
        <span className="eyebrow">Step Into Fresh Looks</span>
        <h2>Elegance Redefined for Him &amp; Her</h2>
      </div>
      <div className="split-banner">
        <div className="split-panel panel-1">
          <img src="https://images.pexels.com/photos/33667866/pexels-photo-33667866.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Luxury Pret" />
          <h3>Luxury</h3>
          <a href="#products" className="btn btn-light" onClick={(e) => { e.preventDefault(); onFilterLink("luxury", "Luxury Pret"); }}>Shop Now</a>
        </div>
        <div className="split-panel panel-2">
          <img src="https://images.pexels.com/photos/8622059/pexels-photo-8622059.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Menswear" />
          <h3>Men</h3>
          <a href="#products" className="btn btn-light" onClick={(e) => { e.preventDefault(); onFilterLink("men", "Men"); }}>Shop Now</a>
        </div>
      </div>
    </>
  );
}

const ACC_ITEMS = [
  { label: "Wraps", filter: "wraps", img: "/images/wrap-embroidered-gold-trellis.jpg" },
  { label: "Footwear", filter: "footwear", img: "/images/shoe-boutique-black.jpg" },
  { label: "Bags", filter: "bags", img: "/images/bag-studio-tote-ivory.jpg" },
];

export function Accessories({ onFilterLink }) {
  return (
    <section className="section" id="accessories">
      <div className="section-head">
        <span className="eyebrow">Complete the Look</span>
        <h2>Accessories</h2>
      </div>
      <div className="acc-grid">
        {ACC_ITEMS.map((item) => (
          <div className="acc-item" key={item.label}>
            <img src={item.img} alt={item.label} />
            <div className="acc-label">
              <div>{item.label}</div>
              <a
                href="#products"
                className="link-underline"
                style={{ color: "white" }}
                onClick={(e) => { e.preventDefault(); onFilterLink(item.filter, item.label); }}
              >
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
