import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'mini_ecommerce_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
      return [];
    }
  });

  // Keep localStorage synchronized whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to persist cart to localStorage', err);
    }
  }, [cartItems]);

  /**
   * Add a product to the cart with quantity boundary check.
   */
  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return;

    const availableStock = Number(product.stock) || 0;
    if (availableStock <= 0) {
      toast.error(`"${product.name}" is currently out of stock`);
      return false;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const requestedTotal = currentQty + quantity;

        if (requestedTotal > availableStock) {
          toast.error(
            `Cannot add more. Only ${availableStock} in stock (you already have ${currentQty} in cart)`
          );
          // Set to maximum available stock if not already at maximum
          if (currentQty < availableStock) {
            const updated = [...prevItems];
            updated[existingIndex] = {
              ...updated[existingIndex],
              product,
              quantity: availableStock,
            };
            toast.success(`Updated "${product.name}" to max available stock (${availableStock})`);
            return updated;
          }
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          product,
          quantity: requestedTotal,
        };
        toast.success(`Updated "${product.name}" quantity (${requestedTotal})`);
        return updated;
      } else {
        const initialQty = Math.min(Math.max(1, quantity), availableStock);
        toast.success(`Added "${product.name}" to cart`);
        return [...prevItems, { product, quantity: initialQty }];
      }
    });

    return true;
  };

  /**
   * Update quantity of an existing item in cart enforcing [1, stock] bounds.
   */
  const updateQuantity = (productId, newQty) => {
    setCartItems((prevItems) => {
      const targetIndex = prevItems.findIndex(
        (item) => item.product._id === productId
      );
      if (targetIndex === -1) return prevItems;

      const item = prevItems[targetIndex];
      const maxStock = Number(item.product.stock) || 1;

      if (newQty > maxStock) {
        toast.error(`Maximum available stock is ${maxStock}`);
        newQty = maxStock;
      } else if (newQty < 1) {
        newQty = 1;
      }

      const updated = [...prevItems];
      updated[targetIndex] = {
        ...item,
        quantity: newQty,
      };
      return updated;
    });
  };

  /**
   * Remove a single product item from the cart.
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const removedItem = prevItems.find((i) => i.product._id === productId);
      if (removedItem) {
        toast.success(`Removed "${removedItem.product.name}" from cart`);
      }
      return prevItems.filter((item) => item.product._id !== productId);
    });
  };

  /**
   * Clear all items from the cart.
   */
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear cart storage', err);
    }
  };

  // Computed: total quantity count of all cart items
  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  }, [cartItems]);

  // Computed: total subtotal amount
  const subtotalPrice = useMemo(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = Number(item.product?.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);
    return Number(total.toFixed(2));
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
