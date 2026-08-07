import { useState } from "react";
import { currentList } from "../data/catalog";
import { useProducts } from "../data/productsStore";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";

import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { PanelStrip, CatStrip, ProductGrid } from "../components/ProductSections";
import { SplitBanner, Accessories } from "../components/SplitAndAccessories";
import { Newsletter, Footer } from "../components/NewsletterFooter";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import SearchOverlay from "../components/SearchOverlay";
import Toast from "../components/Toast";

const PAGE_SIZE = 8;

export default function StorePage() {
  const { message, show, showToast } = useToast();
  const { products } = useProducts();
  const { cart, addToCart, changeQty, removeItem, clearCart, subtotal, totalQty } = useCart(products, showToast);

  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const fullList = currentList(products, filter);
  const visibleList = fullList.slice(0, visibleCount);

  const selectFilter = (f, toastMsg) => {
    setFilter(f);
    setVisibleCount(PAGE_SIZE);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (toastMsg) showToast(toastMsg);
  };

  const onFilterLink = (f, label) => selectFilter(f, `Showing ${label}`);

  const handleCatSelect = (f) => selectFilter(f);

  const handleViewAll = () => {
    if (visibleCount >= fullList.length) {
      setVisibleCount(PAGE_SIZE);
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setVisibleCount(fullList.length);
      showToast(`Showing ${fullList.length} ${filter === "all" ? "all products" : fullList[0]?.label ?? ""}`);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    clearCart();
    setCartOpen(false);
    setCheckoutOpen(false);
  };

  const handleSearchPick = (product) => {
    setSearchOpen(false);
    selectFilter(product.cat, `Showing ${product.label}`);
  };

  const viewAllLabel =
    fullList.length > visibleList.length
      ? `View All (${fullList.length - visibleList.length} more)`
      : fullList.length > PAGE_SIZE
      ? "Show Less"
      : null;

  return (
    <>
      <AnnouncementBar />
      <Header
        cartCount={totalQty}
        onCartClick={() => setCartOpen(true)}
        onFilterLink={onFilterLink}
        onSearchClick={() => setSearchOpen(true)}
        showToast={showToast}
      />

      <Hero onFilterLink={onFilterLink} />

      <PanelStrip onFilterLink={onFilterLink} />

      <CatStrip current={filter} onSelect={handleCatSelect} />

      <section className="section" id="products">
        <div className="section-head">
          <span className="eyebrow">Most Popular</span>
          <h2>Best Sellers</h2>
        </div>
        <ProductGrid products={visibleList} onAddToCart={addToCart} />
        <div className="view-all-wrap">
          {viewAllLabel && (
            <button className="view-all-btn" onClick={handleViewAll}>{viewAllLabel}</button>
          )}
        </div>
      </section>

      <SplitBanner onFilterLink={onFilterLink} />

      <Accessories onFilterLink={onFilterLink} />

      <Newsletter showToast={showToast} />

      <Footer />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        products={products}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        open={checkoutOpen}
        subtotal={subtotal}
        cart={cart}
        products={products}
        onClose={() => setCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      <SearchOverlay
        open={searchOpen}
        products={products}
        onClose={() => setSearchOpen(false)}
        onPickResult={handleSearchPick}
      />

      <Toast message={message} show={show} />
    </>
  );
}
