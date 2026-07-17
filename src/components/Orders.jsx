import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getUserOrders } from "../services/orderService";
import { inr } from "../components/Price";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const user = getAuth().currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container section">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <h3>Order #{order.id.slice(0, 8)}</h3>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Total:</strong> {inr(order.total)}
            </p>

            <p>
              <strong>Customer:</strong> {order.customerName}
            </p>

            <hr />

            {order.items.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "10px 0",
                }}
              >
                <span>
                  {item.name} × {item.qty}
                </span>

                <strong>{inr(item.price * item.qty)}</strong>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}