import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import getApiURL from '@/components/widgets/GetApiURL';

const CartContext = createContext();
const LOCAL_STORAGE_KEY = 'tag_cart_items';

export function CartProvider({ children }) {
    const { data: session } = useSession();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const api_url = getApiURL();

    // 1. Initial Load from LocalStorage (Instant UI feedback before APIs)
    useEffect(() => {
        try {
            const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedItems) {
                setCartItems(JSON.parse(savedItems));
            }
        } catch (e) {
            console.error("Local storage error", e);
        }
        setLoading(false);
    }, []);

    // 2. Sync State modifications into LocalStorage continuously 
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems, loading]);

    // 3. Fetch Cart from Backend on Authenticated Load (Overwrite Local if server states exist)
    useEffect(() => {
        const fetchCart = async () => {
            if (!session?.user?.id) return;
            
            try {
                const res = await fetch(`/api/cart?userId=${session.user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.items && data.items.length > 0) {
                        setCartItems(data.items);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch cart from server", err);
            }
        };

        if (session?.user?.id && !loading) {
            fetchCart();
        }
    }, [session?.user?.id, loading]);

    // 4. Add Item to Cart
    const addToCart = async (listing, quantity = 1) => {
        // <-- FIXED HERE: Safely extract ID into a uniform string to prevent ID/Guid mismatch
        const rawId = listing.listingId || listing.listingID || listing.id;
        const normalizedId = String(rawId);
        
        const newItem = { 
            listingId: normalizedId, 
            quantity: Number(quantity), 
            listing: listing 
        };

        setCartItems(prev => {
            // <-- FIXED HERE: Compare them strictly as strings
            const existing = prev.find(item => String(item.listingId) === normalizedId);
            
            if (existing) {
                return prev.map(item => 
                    String(item.listingId) === normalizedId 
                        ? { ...item, quantity: item.quantity + newItem.quantity } 
                        : item
                );
            }
            return [...prev, newItem];
        });

        setIsCartOpen(true); 

        if (session?.user?.id) {
            try {
                await fetch(`/api/cart/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        userId: session.user.id, 
                        listingId: rawId, // Note: The C# backend usually expects ints, so sending original
                        quantity: newItem.quantity 
                    })
                });
            } catch (e) {
                console.error("API Sync failed", e);
            }
        }
    };

    // 5. Update Quantity
    const updateQuantity = async (listingId, quantity) => {
        const normalizedId = String(listingId);

        if (quantity < 1) return removeFromCart(listingId);

        setCartItems(prev => prev.map(item => 
            String(item.listingId) === normalizedId 
                ? { ...item, quantity } 
                : item
        ));

        if (session?.user?.id) {
            try {
                await fetch(`/api/cart/update`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: session.user.id, listingId, quantity })
                });
            } catch (e) { }
        }
    };

    // 6. Remove Item
    const removeFromCart = async (listingId) => {
        const normalizedId = String(listingId);
        
        setCartItems(prev => prev.filter(item => String(item.listingId) !== normalizedId));

        if (session?.user?.id) {
            try {
                await fetch(`/api/cart/remove`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: session.user.id, listingId })
                });
            } catch (e) { }
        }
    };

    // 7. Clear Entire Cart (After Checkout)
    const clearCart = () => {
        setCartItems(prev => {
            if (prev.length === 0) return prev;
            return [];
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem('checkout_shipping_address');
        localStorage.removeItem('checkout_billing_address');
    };

    const cartTotal = cartItems.reduce((total, item) => total + (Number(item.listing?.price || 0) * Number(item.quantity)), 0);
    const cartCount = cartItems.reduce((count, item) => count + Number(item.quantity), 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            cartCount, 
            cartTotal, 
            loading, 
            addToCart, 
            updateQuantity, 
            removeFromCart,
            clearCart,          
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);