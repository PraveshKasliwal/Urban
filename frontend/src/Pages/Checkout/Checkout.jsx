import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, Checkbox, Button, Text, Flex } from "@mantine/core";
import axios from "axios";

import { useCart } from "../../Context/CartContext";

import "./Checkout.css";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    const [form, setForm] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        postalCode: "",
        saveInfo: false,
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }, [cartItems]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            console.log(`subtotal: ${subtotal}`);
            if (!subtotal || subtotal <= 0) {
                alert("Invalid payment amount");
                return;
            }

            const orderRes = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_LINK}/api/payment/create-order`,
                { amount: subtotal },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const order = orderRes.data;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Urban Store",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        console.log(`handle: ${response}`);
                        await axios.post(
                            `${import.meta.env.VITE_APP_BACKEND_LINK}/api/payment/verify`,
                            response,
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }
                        );
                        const res = await axios.post(
                            `${import.meta.env.VITE_APP_BACKEND_LINK}/api/order/create`,
                            {
                                items: cartItems,
                                shippingInfo: form,
                                payment: {
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                },
                                totalAmount: subtotal,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }
                        );
                        console.log(res);
                        alert("Order placed successfully ");
                        navigate(`/order-success`);
                    } catch (err) {
                        console.log(`verfiy error: ${err}`)
                    }
                },

                prefill: {
                    name: `${form.firstName} ${form.lastName}`,
                    email: form.email,
                    contact: form.phone,
                },

                theme: {
                    color: "#c36522",
                },
            };
            console.log("Razorpay Options:", options);
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.log(`verify: ${err}`);
        }
    };


    return (
        <div className="checkout-container">
            <main className="checkout-left">

                <form className="checkout-form" onSubmit={handleSubmit}>
                    {/* CONTACT */}
                    <Flex direction={"column"} gap={10}>
                        <h2 className="section-title">Contact Information</h2>

                        <TextInput
                            label="Email Address"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />

                        <TextInput
                            label="Phone Number"
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            required
                        />
                    </Flex>

                    {/* ADDRESS */}
                    <section>
                        <h2 className="section-title">Shipping Address</h2>

                        <div className="two-col">
                            <TextInput
                                label="First Name"
                                value={form.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                required
                            />
                            <TextInput
                                label="Last Name"
                                value={form.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                required
                            />
                        </div>

                        <TextInput
                            label="Address"
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            required
                        />

                        <TextInput
                            label="Apartment (optional)"
                            value={form.apartment}
                            onChange={(e) => handleChange("apartment", e.target.value)}
                        />

                        <div className="two-col">
                            <TextInput
                                label="City"
                                value={form.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                                required
                            />
                            <TextInput
                                label="Postal Code"
                                value={form.postalCode}
                                onChange={(e) => handleChange("postalCode", e.target.value)}
                                required
                            />
                        </div>
                    </section>

                    <Button type="submit" size="lg" fullWidth className="continue-btn">
                        Continue to Payment
                    </Button>
                </form>
            </main>

            {/* RIGHT – ORDER SUMMARY */}
            <aside className="checkout-right">
                <h3 className="summary-title">Order Summary</h3>

                {/* 🛒 CART ITEMS */}
                {cartItems.length === 0 ? (
                    <Text c="dimmed">Your cart is empty</Text>
                ) : (
                    cartItems.map((item) => (
                        <div key={`${item._id}-${item.size}`} className="summary-item">
                            <div className="summary-image">
                                <img src={item.image} alt={item.name} />
                                <span className="qty-badge">{item.quantity}</span>
                            </div>

                            <div className="summary-info">
                                <Text fw={600}>{item.name}</Text>
                                <Text size="xs" c="dimmed">
                                    Size {item.size}
                                </Text>
                            </div>

                            <Text fw={600}>
                                ₹{item.price * item.quantity}
                            </Text>
                        </div>
                    ))
                )}

                {/* PRICE */}
                <div className="price-breakdown">
                    <Flex justify="space-between">
                        <Text c="dimmed">Subtotal</Text>
                        <Text fw={600}>₹{subtotal}</Text>
                    </Flex>

                    <Flex justify="space-between" className="total-row">
                        <Text fw={700}>Total</Text>
                        <Text fw={700} size="xl">
                            ₹{subtotal}
                        </Text>
                    </Flex>
                </div>
            </aside>
        </div>
    );
};

export default Checkout;