import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectProducts, selectCategoryTitles } from '../../store/products.selector';
import {
  addProductThunk,
  updateProductThunk,
  deleteProductThunk
} from '../../store/products.reducer';
import FormInput from '../form-input/form-input.component';
import './admin-components.styles.scss';

const emptyForm = {
  name: '',
  category: 'Hats',
  price: '',
  imageUrl: '',
  description: ''
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categoryTitles = useSelector(selectCategoryTitles);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      category: product.category || 'Hats',
      price: product.price != null ? String(product.price) : '',
      imageUrl: product.imageUrl || '',
      description: product.description || ''
    });
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim()
    };

    if (!payload.name || !Number.isFinite(payload.price)) {
      alert('Product name and a valid price are required.');
      return;
    }

    if (editingId) {
      dispatch(updateProductThunk({ productId: editingId, updates: payload }));
    } else {
      dispatch(addProductThunk(payload));
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      dispatch(deleteProductThunk(product.id));
    }
  };

  return (
    <div className='admin-products'>
      <div className='admin-section-head'>
        <h2>Products ({products.length})</h2>
        <button type='button' className='btn-primary' onClick={openAdd}>+ Add Product</button>
      </div>

      {showForm && (
        <form className='admin-product-form' onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <div className='form-grid'>
            <FormInput label='Product Name' type='text' name='name' value={form.name} onChange={handleChange} required />
            <div className='group'>
              <label className='field-label'>Category</label>
              <input
                list='category-options'
                className='form-input'
                name='category'
                value={form.category}
                onChange={handleChange}
                required
              />
              <datalist id='category-options'>
                {categoryTitles.map((title) => <option key={title} value={title} />)}
              </datalist>
            </div>
            <FormInput label='Price (USD)' type='number' name='price' value={form.price} onChange={handleChange} min='0' step='0.01' required />
            <FormInput label='Image URL' type='text' name='imageUrl' value={form.imageUrl} onChange={handleChange} />
            <div className='group full'>
              <label className='field-label'>Description</label>
              <textarea
                className='form-input'
                name='description'
                rows='3'
                value={form.description}
                onChange={handleChange}
                placeholder='Short product description (optional)'
              />
            </div>
          </div>
          <div className='form-actions'>
            <button type='submit' className='btn-primary'>{editingId ? 'Save Changes' : 'Add Product'}</button>
            <button type='button' className='btn-secondary' onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <p className='empty-note'>No products yet. Add your first product above.</p>
      ) : (
        <div className='table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className='thumb-cell'>
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name} className='thumb' />
                      : <span className='thumb-placeholder'>—</span>}
                  </td>
                  <td className='product-name'>{product.name}</td>
                  <td>{product.category}</td>
                  <td>$ {(Number(product.price) || 0).toFixed(2)}</td>
                  <td>
                    <div className='row-actions'>
                      <button type='button' onClick={() => openEdit(product)}>Edit</button>
                      <button type='button' className='danger' onClick={() => handleDelete(product)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
