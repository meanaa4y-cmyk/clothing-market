import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../data/productsStore";
import { CATEGORY_OPTIONS, fmt } from "../data/catalog";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const EMPTY_FORM = {
  name: "", cat: CATEGORY_OPTIONS[0], label: "Unstitched",
  price: "", oldPrice: "", isNew: true, img: "",
};

const CAT_LABELS = {
  unstitched: "Unstitched", ready: "Ready to Wear", luxury: "Luxury Pret",
  men: "Men", wraps: "Wraps", footwear: "Footwear", bags: "Bags",
};

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { products, loading, usingFallback, addProduct, updateProduct, deleteProduct, seedFromDemoCatalog } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "", cat: p.cat || CATEGORY_OPTIONS[0], label: p.label || CAT_LABELS[p.cat] || "",
      price: p.price ?? "", oldPrice: p.oldPrice ?? "", isNew: !!p.isNew, img: p.img || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const onCatChange = (cat) => setForm((f) => ({ ...f, cat, label: CAT_LABELS[cat] }));

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `products/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, img: url }));
    } catch (err) {
      alert("Image upload failed: " + (err?.message || err));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        cat: form.cat,
        label: form.label,
        price: Number(form.price) || 0,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        isNew: !!form.isNew,
        img: form.img.trim() || "https://images.pexels.com/photos/20791983/pexels-photo-20791983.jpeg?auto=compress&cs=tinysrgb&w=800",
      };
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct(payload);
      }
      setModalOpen(false);
    } catch (err) {
      alert("Save failed: " + (err?.message || err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    try {
      await deleteProduct(p.id);
    } catch (err) {
      alert("Delete failed: " + (err?.message || err));
    }
  };

  const onSeed = async () => {
    if (!confirm("Seed Firestore with the demo catalog? This adds the generated products as real, editable documents.")) return;
    setSeeding(true);
    try {
      await seedFromDemoCatalog();
    } catch (err) {
      alert("Seeding failed: " + (err?.message || err));
    } finally {
      setSeeding(false);
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <span className="logo">LINEN<span>HOUSE</span> · Admin</span>
        <div className="admin-user">
          <Link to="/" style={{ textDecoration: "underline" }}>View Store</Link>
          <span>{user?.email}</span>
          <button onClick={onLogout}>Log Out</button>
        </div>
      </div>

      <div className="admin-body">
        <div className="admin-head">
          <div>
            <h1>Products</h1>
            <div className="admin-stats">
              {loading ? "Loading…" : `${products.length} product${products.length === 1 ? "" : "s"}`}
              {usingFallback && !loading && " · showing the demo catalog (not yet saved to Firestore)"}
            </div>
          </div>
          <div className="admin-actions">
            {usingFallback && (
              <button className="btn btn-dark" onClick={onSeed} disabled={seeding}>
                {seeding ? "Seeding…" : "Seed Demo Catalog"}
              </button>
            )}
            <button className="btn btn-clay" onClick={openAdd}>+ Add Product</button>
          </div>
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-empty">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="admin-empty">No products yet. Add one to get started.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Flags</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td><img src={p.img} alt={p.name} /></td>
                    <td>{p.name}</td>
                    <td>{p.label || CAT_LABELS[p.cat]}</td>
                    <td>
                      {p.oldPrice ? <span style={{ textDecoration: "line-through", opacity: 0.5, marginRight: 6 }}>{fmt(p.oldPrice)}</span> : null}
                      {fmt(p.price)}
                    </td>
                    <td>{[p.isNew && "New", p.oldPrice && "Sale"].filter(Boolean).join(", ") || "—"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button onClick={() => openEdit(p)} disabled={usingFallback}>Edit</button>
                        <button className="danger" onClick={() => onDelete(p)} disabled={usingFallback}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={onSubmit}>
              <div className="field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="2 Piece Embroidered Suit — Vetiver" />
              </div>

              <div className="admin-form-row">
                <div className="field">
                  <label>Category</label>
                  <select value={form.cat} onChange={(e) => onCatChange(e.target.value)}>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{CAT_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Display Label</label>
                  <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="field">
                  <label>Price (Rs.)</label>
                  <input type="number" required min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Old Price (optional, for Sale tag)</label>
                  <input type="number" min="0" value={form.oldPrice} onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))} />
                </div>
              </div>

              <div className="admin-checkbox-row">
                <label>
                  <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />
                  New In
                </label>
              </div>

              <div className="field">
                <label>Image</label>
                {form.img && <img className="admin-image-preview" src={form.img} alt="preview" />}
                <input value={form.img} onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))} placeholder="https://... or upload below" />
                <input type="file" accept="image/*" onChange={onFileChange} style={{ marginTop: 8 }} />
                {uploading && <div className="admin-upload-status">Uploading…</div>}
              </div>

              <div className="admin-form-actions">
                <button type="button" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary" disabled={saving || uploading}>
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
