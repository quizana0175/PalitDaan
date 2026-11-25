import { useEffect, useState } from 'react';
import { defaultMenuItems, getMenuItems, saveMenuItems } from '../utils/menu';
import '../css/AdminPage.css';

const ORDER_STATUSES = [
  'Pending Payment',
  'Paid & Preparing',
  'Being Prepared',
  'Ready for Pickup',
  'Completed',
  'Canceled',
];

function readOrders() {
  const pendingOrders = JSON.parse(localStorage.getItem('pending_orders') || '[]');
  const orderHistory = JSON.parse(localStorage.getItem('order_history') || '[]');
  const ordersById = new Map();

  orderHistory.forEach((order) => ordersById.set(order.id, order));
  pendingOrders.forEach((order) => ordersById.set(order.id, order));

  return Array.from(ordersById.values()).sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateB - dateA;
  });
}

function readOrderList(key) {
  const orders = JSON.parse(localStorage.getItem(key) || '[]');
  return Array.isArray(orders) ? orders : [];
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setOrders(readOrders());
    setMenuItems(getMenuItems());
  }, []);

  function handleStatusChange(orderId, status) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) {
      setError('That order could not be found. Refresh and try again.');
      return;
    }

    const updatedOrder = { ...order, status, statusUpdatedAt: new Date().toISOString() };
    const pendingOrders = readOrderList('pending_orders');
    const orderHistory = readOrderList('order_history');
    const isClosed = status === 'Completed' || status === 'Canceled';

    const updatedPending = isClosed
      ? pendingOrders.filter((item) => item.id !== orderId)
      : pendingOrders.some((item) => item.id === orderId)
        ? pendingOrders.map((item) => item.id === orderId ? updatedOrder : item)
        : [updatedOrder, ...pendingOrders];

    const updatedHistory = isClosed
      ? [updatedOrder, ...orderHistory.filter((item) => item.id !== orderId)]
      : orderHistory.filter((item) => item.id !== orderId);

    localStorage.setItem('pending_orders', JSON.stringify(updatedPending));
    localStorage.setItem('order_history', JSON.stringify(updatedHistory));
    setOrders(readOrders());
    setError('');
    setMessage(`Order ${orderId} updated to ${status}.`);
  }

  function handleRestock(itemId) {
    const amount = Number.parseInt(restockAmounts[itemId], 10);
    if (!Number.isInteger(amount) || amount <= 0) {
      setError('Enter a restock quantity greater than zero.');
      setMessage('');
      return;
    }

    const updatedItems = menuItems.map((item) =>
      item.id === itemId ? { ...item, stock: item.stock + amount } : item
    );
    saveMenuItems(updatedItems);
    setMenuItems(updatedItems);
    setRestockAmounts({ ...restockAmounts, [itemId]: '' });
    setError('');
    setMessage('Inventory restocked.');
  }

  function handleNewItemChange(event) {
    setNewItem({ ...newItem, [event.target.name]: event.target.value });
  }

  function handleAddItem(event) {
    event.preventDefault();
    const price = Number(newItem.price);
    const stock = Number(newItem.stock);

    if (!newItem.name.trim() || !newItem.description.trim()
      || !Number.isFinite(price) || price < 0
      || !Number.isInteger(stock) || stock < 0) {
      setError('Enter a name, description, valid price, and whole-number starting stock.');
      setMessage('');
      return;
    }

    const item = {
      id: Date.now(),
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price,
      stock,
      image: newItem.image.trim() || defaultMenuItems[2].image,
    };
    const updatedItems = [...menuItems, item];

    saveMenuItems(updatedItems);
    setMenuItems(updatedItems);
    setNewItem({ name: '', description: '', price: '', stock: '', image: '' });
    setError('');
    setMessage(`${item.name} was added to the menu.`);
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <p className="admin-eyebrow">Palit Daan operations</p>
        <h1>Admin Panel</h1>
        <p>Manage order progress and keep the customer menu and stock up to date.</p>
      </header>

      {(error || message) && (
        <p className={`admin-notice ${error ? 'admin-notice-error' : ''}`} role="status">
          {error || message}
        </p>
      )}

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>Order Management</h2>
            <p>Update order status as orders move through preparation and pickup.</p>
          </div>
          <span className="admin-count">{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <p className="admin-empty">There are no orders to manage yet.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      <small>{order.date}</small>
                    </td>
                    <td>{order.customerName || 'Customer'}</td>
                    <td>{(order.items || []).map((item) => `${item.quantity}× ${item.food.name}`).join(', ')}</td>
                    <td>₱{Number(order.total || 0).toFixed(2)}</td>
                    <td>
                      <select
                        aria-label={`Status for order ${order.id}`}
                        value={ORDER_STATUSES.includes(order.status) ? order.status : 'Pending Payment'}
                        onChange={(event) => handleStatusChange(order.id, event.target.value)}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>Menu &amp; Inventory</h2>
            <p>Restock items here. Stock is deducted when a customer places an order.</p>
          </div>
          <span className="admin-count">{menuItems.length} menu items</span>
        </div>

        <div className="admin-inventory-list">
          {menuItems.map((item) => (
            <div className="admin-inventory-row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>₱{Number(item.price).toFixed(2)} · {item.stock} in stock</span>
              </div>
              <div className="admin-restock-controls">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={restockAmounts[item.id] || ''}
                  onChange={(event) => setRestockAmounts({
                    ...restockAmounts,
                    [item.id]: event.target.value,
                  })}
                  aria-label={`Restock amount for ${item.name}`}
                  placeholder="Qty"
                />
                <button type="button" onClick={() => handleRestock(item.id)}>Restock</button>
              </div>
            </div>
          ))}
        </div>

        <form className="admin-add-form" onSubmit={handleAddItem}>
          <h3>Add a Menu Item</h3>
          <div className="admin-add-fields">
            <label>
              Item name
              <input name="name" value={newItem.name} onChange={handleNewItemChange} required />
            </label>
            <label>
              Price (₱)
              <input name="price" type="number" min="0" step="0.01" value={newItem.price} onChange={handleNewItemChange} required />
            </label>
            <label>
              Starting stock
              <input name="stock" type="number" min="0" step="1" value={newItem.stock} onChange={handleNewItemChange} required />
            </label>
            <label className="admin-field-wide">
              Description
              <input name="description" value={newItem.description} onChange={handleNewItemChange} required />
            </label>
            <label className="admin-field-wide">
              Image URL <span>(optional)</span>
              <input name="image" type="url" value={newItem.image} onChange={handleNewItemChange} />
            </label>
          </div>
          <button type="submit" className="admin-add-button">Add Item</button>
        </form>
      </section>
    </div>
  );
}
