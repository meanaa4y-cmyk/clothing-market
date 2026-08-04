import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectProducts } from '../../store/products.selector';
import { selectOrders } from '../../store/orders.selector';
import './admin-components.styles.scss';

const AdminDashboard = ({ onNavigate }) => {
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;
    const revenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    return { totalProducts, totalOrders, pendingOrders, revenue };
  }, [products, orders]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className='admin-dashboard'>
      <div className='stats-grid'>
        <div className='stat-card'>
          <span className='stat-label'>Total Products</span>
          <strong className='stat-value'>{stats.totalProducts}</strong>
        </div>
        <div className='stat-card'>
          <span className='stat-label'>Total Orders</span>
          <strong className='stat-value'>{stats.totalOrders}</strong>
        </div>
        <div className='stat-card'>
          <span className='stat-label'>Pending Orders</span>
          <strong className='stat-value'>{stats.pendingOrders}</strong>
        </div>
        <div className='stat-card'>
          <span className='stat-label'>Revenue</span>
          <strong className='stat-value'>$ {stats.revenue.toFixed(2)}</strong>
        </div>
      </div>

      <div className='admin-section'>
        <div className='admin-section-head'>
          <h2>Recent Orders</h2>
          <button type='button' onClick={() => onNavigate('orders')}>View all orders</button>
        </div>
        {recentOrders.length === 0 ? (
          <p className='empty-note'>No orders yet. Orders placed on the store will show up here.</p>
        ) : (
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className='order-id'>#{order.id.slice(0, 8)}</td>
                  <td>{order.customer?.name || 'Unknown'}</td>
                  <td>{order.items?.length || 0}</td>
                  <td>$ {(Number(order.total) || 0).toFixed(2)}</td>
                  <td><span className={`status-pill ${order.status}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
