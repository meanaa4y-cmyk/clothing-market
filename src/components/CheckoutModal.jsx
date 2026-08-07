import { useState } from "react";
import { fmt } from "../data/catalog";

export default function CheckoutModal({ open, subtotal, onClose, onOrderComplete }) {
  const [orderNum, setOrderNum] = useState(null);

  const submitOrder = (e) => {
    e.preventDefault();
    setOrderNum("LH-" + Math.floor(100000 + Math.random() * 900000));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setOrderNum(null), 300);
  };

  const handleDone = () => {
    onOrderComplete();
    setOrderNum(null);
  };

  return (
    <div className={`modal-overlay ${open ? "open" : ""}`}>
      <div className="modal">
        <button className="modal-close" onClick={handleClose}>×</button>
        {orderNum ? (
          <div className="success-screen">
            <div className="check">✓</div>
            <h2>Order Confirmed</h2>
            <p style={{ fontFamily: "Helvetica, Arial, sans-serif", opacity: 0.75, margin: "12px 0 20px" }}>
              Order <strong>{orderNum}</strong> has been placed.<br />
              A confirmation has been sent to your email.
            </p>
            <button className="btn btn-dark" onClick={handleDone}>Done</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Checkout</span>
            <h2>Delivery Details</h2>
            <form onSubmit={submitOrder}>
              <div className="field"><label>Full Name</label><input type="text" required placeholder="Aisha Khan" /></div>
              <div className="field"><label>Email</label><input type="email" required placeholder="you@example.com" /></div>
              <div className="field-row">
                <div className="field"><label>City</label><input type="text" required placeholder="Lahore" /></div>
                <div className="field"><label>Postal Code</label><input type="text" required placeholder="54000" /></div>
              </div>
              <div className="field"><label>Address</label><input type="text" required placeholder="House / Street / Area" /></div>
              <div className="field">
                <label>Payment Method</label>
                <select>
                  <option>Cash on Delivery</option>
                  <option>Credit / Debit Card</option>
                </select>
              </div>
              <div className="modal-total"><span>Order Total</span><span>{fmt(subtotal)}</span></div>
              <button type="submit" className="btn btn-clay" style={{ width: "100%" }}>Place Order</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
