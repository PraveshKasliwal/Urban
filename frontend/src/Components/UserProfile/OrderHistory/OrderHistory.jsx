import { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_LINK}/api/order/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("FETCH ORDERS ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading orders...</p>;

  if (orders.length === 0)
    return <p className="empty-text">No orders placed yet.</p>;

  return (
    <section className="order-history-container">
      <div className="order-header">
        <h2>Order History</h2>
        <p>You have placed {orders.length} orders.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-top">
              <div>
                <span className="label">Order ID</span>
                <p className="value">{order._id.slice(-8)}</p>
              </div>

              <div>
                <span className="label">Placed On</span>
                <p className="value">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <span className="label">Total</span>
                <p className="value">₹{order.totalAmount}</p>
              </div>

              <span className={`status ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-meta">
                      Size {item.size} • Qty {item.quantity}
                    </p>
                  </div>
                  <p className="item-price">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderHistory;
