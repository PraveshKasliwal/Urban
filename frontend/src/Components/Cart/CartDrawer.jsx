import { Drawer, Button, Text, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { FiMinus, FiPlus } from "react-icons/fi";
import "./CartDrawer.css";

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems, increaseQty, decreaseQty } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        closeCart();
        navigate("/checkout");
    };

    return (
        <Drawer
            opened={isCartOpen}
            onClose={closeCart}
            position="right"
            size="md"
            title="Your Bag"
            zIndex={10000}
        >
            {cartItems.length === 0 ? (
                <Text c="dimmed">Your cart is empty</Text>
            ) : (
                <div className="cart-wrapper">
                    {cartItems.map((item) => (
                        <div key={`${item._id}-${item.size}`} className="cart-row">
                            <img src={item.image} alt={item.name} className="cart-img" />

                            <div className="cart-details">
                                <Text fw={500}>{item.name}</Text>
                                <Text size="sm" c="dimmed">
                                    ₹{item.price.toFixed(2)}
                                </Text>

                                <Text size="xs" c="dimmed">
                                    Size: {item.size}
                                </Text>
                            </div>

                            <div className="cart-qty">
                                <button className="qty-btn" onClick={() => decreaseQty(item._id, item.size)}>
                                    <FiMinus size={14} />
                                </button>

                                <span className="qty-count">{item.quantity}</span>

                                <button className="qty-btn" onClick={() => increaseQty(item._id, item.size)}>
                                    <FiPlus size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-footer">
                        <Flex justify="space-between">
                            <Text fw={600}>Total</Text>
                            <Text fw={600}>₹ {total.toFixed(2)}</Text>
                        </Flex>

                        <Button
                            fullWidth
                            size="md"
                            color="orange"
                            mt={12}
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default CartDrawer;