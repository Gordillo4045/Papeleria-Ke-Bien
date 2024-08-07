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
    updateQuantity: (id: string, newQuantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (newProduct: Product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === newProduct.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === newProduct.id
                        ? { ...item, cantidad: item.cantidad + newProduct.cantidad }
                        : item
                );
            } else {
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

    const updateQuantity = (id: string, newQuantity: number) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === id ? { ...item, cantidad: newQuantity } : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
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