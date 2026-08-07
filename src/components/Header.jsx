import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ cartCount, onCartClick, onFilterLink, onSearchClick, showToast }) {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 40;
      setSolid(scrolled);
      document.body.classList.toggle("scrolled", scrolled);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const navLink = (filter, label, href) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        setMobileOpen(false);
        onFilterLink(filter, label);
      }}
    >
      {label}
    </a>
  );

  const handleAccountClick = () => {
    if (user) {
      showToast(isAdmin ? "Signed in as admin. Opening dashboard…" : `Signed in as ${user.email}`);
      if (isAdmin) navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header id="siteHeader" className={solid ? "solid" : ""}>
        <div className="topbar">
          <button className="mobile-nav-toggle" onClick={() => setMobileOpen(true)}>☰</button>
          <div className="logo">LINEN<span>HOUSE</span></div>
          <nav className="mainnav">
            <a href="#women" onClick={(e) => { e.preventDefault(); onFilterLink("ready", "Women"); }}>Women</a>
            <a href="#luxury" onClick={(e) => { e.preventDefault(); onFilterLink("luxury", "Luxury"); }}>Luxury</a>
            <a href="#men" onClick={(e) => { e.preventDefault(); onFilterLink("men", "Men"); }}>Men</a>
            <a href="#accessories" onClick={(e) => { e.preventDefault(); onFilterLink("accessories", "Accessories"); }}>Accessories</a>
            <a href="#sale" onClick={(e) => { e.preventDefault(); onFilterLink("all", "Sale"); }}>Sale</a>
          </nav>
          <div className="icons">
            <button className="icon-btn" onClick={handleAccountClick} title={user ? user.email : "Sign in"}>👤</button>
            <button className="icon-btn" onClick={onSearchClick}>🔍</button>
            <button className="icon-btn" onClick={onCartClick}>
              🛍<span className="cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>×</button>
        <div className="logo">LINEN<span>HOUSE</span></div>
        {navLink("ready", "Women", "#women")}
        {navLink("luxury", "Luxury", "#luxury")}
        {navLink("men", "Men", "#men")}
        {navLink("accessories", "Accessories", "#accessories")}
        {navLink("all", "Sale", "#products")}
        {user ? (
          <>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
            )}
            <a
              href="#logout"
              onClick={(e) => { e.preventDefault(); setMobileOpen(false); logout(); }}
            >
              Log Out
            </a>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)}>Create Account</Link>
          </>
        )}
      </div>
    </>
  );
}
