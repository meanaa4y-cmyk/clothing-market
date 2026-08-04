import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchProducts } from '../../store/products.reducer';
import { fetchOrders } from '../../store/orders.reducer';

import AdminDashboard from '../../components/admin/admin-dashboard.component.jsx';
import AdminProducts from '../../components/admin/admin-products.component.jsx';
import AdminOrders from '../../components/admin/admin-orders.component.jsx';

import './admin.styles.scss';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const AUTH_KEY = 'monarch-admin-auth';

const Admin = () => {
  const dispatch = useDispatch();
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleLogin = (event) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get('password');

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthed(true);
    } else {
      alert('Incorrect admin password.');
    }
  };

  if (!isAuthed) {
    return (
      <div className='container admin-gate'>
        <h1>Admin Access</h1>
        <p>Enter the admin password to manage the store.</p>
        <form onSubmit={handleLogin} className='admin-gate-form'>
          <input type='password' name='password' placeholder='Admin password' autoFocus />
          <button type='submit'>Enter</button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' }
  ];

  return (
    <div className='container admin-page'>
      <div className='admin-header'>
        <h1>MONARCH Admin</h1>
        <button type='button' className='admin-logout' onClick={() => {
          sessionStorage.removeItem(AUTH_KEY);
          setIsAuthed(false);
        }}>Log out</button>
      </div>
      <div className='admin-tabs'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='admin-content'>
        {activeTab === 'dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
};

export default Admin;
