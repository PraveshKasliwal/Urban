import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Text, Button, Flex, Loader } from "@mantine/core";
import axios from "axios";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_LINK}/api/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="80vh">
        <Loader size="lg" />
      </Flex>
    );
  }

  if (!order) {
    return <Text align="center">Order not found</Text>;
  }

  return (
    <div className="order-success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <Text size="xl" fw={700}>
          Order Placed Successfully!
        </Text>

        <Text c="dimmed" mt={5}>
          Thank you for your purchase
        </Text>

        <div className="order-info">
          <Text size="sm">Order ID</Text>
          <Text fw={600}>{order._id}</Text>
        </div>

        <div className="order-items">
          {order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <img src={item.image} alt={item.name} />
              <div>
                <Text fw={600}>{item.name}</Text>
                <Text size="xs" c="dimmed">
                  Size {item.size} × {item.quantity}
                </Text>
              </div>
              <Text fw={600}>
                ₹{item.price * item.quantity}
              </Text>
            </div>
          ))}
        </div>

        <div className="total-row">
          <Text fw={700}>Total</Text>
          <Text fw={700}>₹{order.totalAmount}</Text>
        </div>

        <Flex gap={10} mt={20}>
          <Button onClick={() => navigate("/")} variant="outline">
            Continue Shopping
          </Button>
          <Button onClick={() => navigate("/profile")}>
            View Orders
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default OrderSuccess;