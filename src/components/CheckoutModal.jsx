import { useState } from "react";
import { fmt } from "../data/catalog";
import { placeOrder } from "../data/ordersStore";

export default function CheckoutModal({ open, subtotal, cart, products, onClose, onOrderComplete }) {
  const [orderNum, setOrderNum] = useState(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [placing, setPlacing] = useState(false);

  const resetFields = () => {
    setName(""); setCity(""); setPostalCode(""); setAddress(""); setPayment("Cash on Delivery");
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    const num = "LH-" + Math.floor(100000 + Math.random() * 900000);
    try {
      const items = (cart || []).map((c) => {
        const p = products?.find((pr) => pr.id === c.id);
        return {
          id: c.id,
          name: p?.name || "",
          price: p?.price || 0,
          qty: c.qty,
        };
      });
      await placeOrder({
        orderNum: num,
        customer: { name, city, postalCode, address },
        items,
        subtotal,
        payment,
      });
      setOrderNum(num);
    } catch (err) {
      alert("Couldn't place order: " + (err?.message || err));
    } finally {
      setPlacing(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setOrderNum(null); resetFields(); }, 300);
  };

  const handleDone = () => {
    onOrderComplete();
    setOrderNum(null);
    resetFields();
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
              Order <strong>{orderNum}</strong> has been placed.
            </p>
            <button className="btn btn-dark" onClick={handleDone}>Done</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Checkout</span>
            <h2>Delivery Details</h2>
            <form onSubmit={submitOrder}>
              <div className="field"><label>Full Name</label><input type="text" required placeholder="Aisha Khan" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="field-row">
                <div className="field"><label>City</label><input type="text" required placeholder="Lahore" value={city} onChange={(e) => setCity(e.target.value)} /></div>
                <div className="field"><label>Postal Code</label><input type="text" required placeholder="54000" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} /></div>
              </div>
              <div className="field"><label>Address</label><input type="text" required placeholder="House / Street / Area" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
              <div className="field">
                <label>Payment Method</label>
                <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                  <option>Cash on Delivery</option>
                  <option>Credit / Debit Card</option>
                </select>
              </div>
              <div className="modal-total"><span>Order Total</span><span>{fmt(subtotal)}</span></div>
              <button type="submit" className="btn btn-clay" style={{ width: "100%" }} disabled={placing}>
                {placing ? "Placing…" : "Place Order"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
