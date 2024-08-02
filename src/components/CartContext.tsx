import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Product {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    imagen: string;
    existencias: string;
    cantidad: number;
}

interface CartContextProps {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (newProduct: Product) => {
        setCart((prevCart) => {
            // Buscar si el producto ya está en el carrito
            const existingProduct = prevCart.find(item => item.id === newProduct.id);
            if (existingProduct) {
                // Actualizar la cantidad si el producto ya está en el carrito
                return prevCart.map(item =>
                    item.id === newProduct.id
                        ? { ...item, cantidad: item.cantidad + newProduct.cantidad }
                        : item
                );
            } else {
                // Agregar el nuevo producto al carrito
                return [...prevCart, newProduct];
            }
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};
