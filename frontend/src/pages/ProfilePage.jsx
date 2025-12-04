import { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:3000/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!user) return;

    setLoadingOrders(true);
    setOrderError("");

    fetch(`${API_BASE}/orders`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 404) {
          setOrders([]);
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const list = Array.isArray(data) ? data : data.orders || [];
        setOrders(list);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setOrderError("Unable to load past orders.");
      })
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (!user) {
    return <p className="text-muted">You are not logged in.</p>;
  }

  return (
    <div>
      <h2 className="page-title">YOUR PROFILE</h2>

      {}
      <Card className="p-4 profile-card mb-4">
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span className="profile-value">{user.name}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Status</span>
          <span className="profile-value">
            Account created successfully and session active.
          </span>
        </div>
      </Card>

      {}
      <h3 className="section-title mb-3">Past Orders</h3>

      {loadingOrders && <Spinner animation="border" />}

      {orderError && <Alert variant="danger">{orderError}</Alert>}

      {!loadingOrders && !orderError && orders.length === 0 && (
        <p className="text-muted small">You haven’t placed any orders yet.</p>
      )}

      {!loadingOrders &&
        !orderError &&
        orders.map((order) => (
          <Card key={order.id} className="mb-3 order-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-end">
                  <div className="order-total">₹{order.total_price}</div>
                  <div className="order-status">
                    {order.status || "Completed"}
                  </div>
                </div>
              </div>

              <hr className="order-divider" />

              <div className="order-items">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <div>
                      <div className="order-item-name">
                        {item.product?.name || "Product"}
                      </div>
                      <div className="order-item-meta">
                        {item.product?.brand} · {item.product?.category}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="order-item-qty">
                        Qty: {item.quantity}
                      </div>
                      <div className="order-item-price">
                        ₹{item.product?.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
}
