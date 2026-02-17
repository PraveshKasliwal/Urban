import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const token = localStorage.getItem("token");

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const fetchCart = async () => {
        if (!token) return;

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_LINK}/api/cart`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCartItems(res.data);
            console.log(`cart: ${JSON.stringify(res.data)}`);
        } catch (err) {
            console.error("FETCH CART ERROR ", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productId, size) => {
        await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_LINK}/api/cart/add`,
            { productId, size },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        fetchCart();
        openCart(); // ✅ UX improvement
    };

    const removeFromCart = async (productId, size) => {
        await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_LINK}/api/cart/remove`,
            { productId, size },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        fetchCart();
    };

    const increaseQty = async (productId, size) => {
        await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_LINK}/api/cart/increase`,
            { productId, size },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchCart();
    };

    const decreaseQty = async (productId, size) => {
        await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_LINK}/api/cart/decrease`,
            { productId, size },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchCart();
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
