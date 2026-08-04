import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectOrders } from '../../store/orders.selector';
import { updateOrderStatusThunk, deleteOrderThunk } from '../../store/orders.reducer';
import './admin-components.styles.scss';

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [expanded, setExpanded] = useState(null);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatusThunk({ orderId, status }));
  };

  const handleDelete = (order) => {
    if (window.confirm(`Delete order #${order.id.slice(0, 8)}?`)) {
      dispatch(deleteOrderThunk(order.id));
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString();
  };

  return (
    <div className='admin-orders'>
      <div className='admin-section-head'>
        <h2>Orders ({orders.length})</h2>
      </div>

      {orders.length === 0 ? (
        <p className='empty-note'>No orders yet. When a customer checks out on the store, the order will appear here instantly.</p>
      ) : (
        <div className='table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <tr className={expanded === order.id ? 'row-open' : ''}>
                    <td className='order-id'>#{order.id.slice(0, 8)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.customer?.name || 'Unknown'}</td>
                    <td>
                      <button
                        type='button'
                        className='link-btn'
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      >
                        {order.items?.length || 0} item(s) {expanded === order.id ? '▴' : '▾'}
                      </button>
                    </td>
                    <td>$ {(Number(order.total) || 0).toFixed(2)}</td>
                    <td>
                      <select
                        className={`status-select ${order.status}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className='row-actions'>
                        <button type='button' className='danger' onClick={() => handleDelete(order)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr className='detail-row'>
                      <td colSpan='7'>
                        <div className='order-detail'>
                          <div className='order-customer'>
                            <p><strong>Email:</strong> {order.customer?.email || '—'}</p>
                            <p><strong>Phone:</strong> {order.customer?.phone || '—'}</p>
                            <p><strong>Address:</strong> {order.customer?.address || '—'}</p>
                          </div>
                          <ul className='order-items'>
                            {(order.items || []).map((item, index) => (
                              <li key={index}>
                                {item.quantity} × {item.name} — $ {(Number(item.price) * item.quantity).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
