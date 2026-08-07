import { fmt } from "../data/catalog";

export default function CartDrawer({ open, cart, products, subtotal, onClose, onChangeQty, onRemove, onCheckout }) {
  return (
    <>
      <div className={`overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <span>Your Cart</span>
          <button onClick={onClose}>×</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">Your cart is empty.<br />Start adding some linens.</div>
          ) : (
            cart.map((item) => {
              const p = products.find((x) => x.id === item.id);
              if (!p) return null;
              return (
                <div className="cart-item" key={item.id}>
                  <div className="cart-thumb"><img src={p.img} alt={p.name} /></div>
                  <div className="cart-item-info">
                    <div className="name">{p.name}</div>
                    <div className="meta">{p.label}</div>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => onChangeQty(p.id, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button className="qty-btn" onClick={() => onChangeQty(p.id, 1)}>+</button>
                      <span className="item-price" style={{ marginLeft: "auto" }}>{fmt(p.price * item.qty)}</span>
                    </div>
                    <button className="remove-btn" onClick={() => onRemove(p.id)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="subtotal-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <button className="btn btn-clay" onClick={onCheckout}>Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}
