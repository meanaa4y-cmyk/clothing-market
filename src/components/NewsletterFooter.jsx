export function Newsletter({ showToast }) {
  const onSubmit = (e) => {
    e.preventDefault();
    showToast("You are subscribed.");
    e.target.reset();
  };
  return (
    <div className="newsletter">
      <span className="eyebrow" style={{ color: "var(--gold)" }}>Stay in the Loop</span>
      <h2 style={{ marginTop: 10 }}>Join the Linen House List</h2>
      <p>New arrivals, seasonal edits and members-only offers — no spam, just linen.</p>
      <form className="nl-form" onSubmit={onSubmit}>
        <input type="email" placeholder="Your email" required />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="logo" style={{ fontSize: 20, marginBottom: 14, color: "var(--ink)" }}>LINEN<span>HOUSE</span></div>
          <p style={{ opacity: 0.7, maxWidth: 280, lineHeight: 1.6 }}>
            Linen, cotton and printed suiting cut for warm-weather ease. Nationwide delivery, easy returns.
          </p>
        </div>
        <div>
          <h4>Information</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blogs</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms &amp; Conditions</a></li>
          </ul>
        </div>
        <div>
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Order Tracking</a></li>
            <li><a href="#">Store Locator</a></li>
            <li><a href="#">Return &amp; Exchange</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>21 Km Ferozpur Road, Lahore, Pakistan</li>
            <li>hello@linenhouse.com</li>
            <li>+92 42 111 000 000</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 LINEN HOUSE. All rights reserved.</span>
        <span>Secure checkout • Cash on delivery available</span>
      </div>
    </footer>
  );
}
