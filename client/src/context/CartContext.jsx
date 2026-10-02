import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      toast.error('Item is out of stock!');
      return false;
    }

    let addedSuccessfully = true;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex > -1) {
        const currentQty = prevItems[existingItemIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} items available in stock.`);
          addedSuccessfully = false;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock.`);
          addedSuccessfully = false;
          return prevItems;
        }

        return [...prevItems, { product, quantity }];
      }
    });

    if (addedSuccessfully) {
      toast.success(`Added ${product.name} to cart!`);
    }
    return addedSuccessfully;
  };

  const updateQuantity = (productId, newQty) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const cappedQty = Math.max(1, Math.min(newQty, item.product.stock));
            return { ...item, quantity: cappedQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
