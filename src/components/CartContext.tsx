import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    const [cart, setCart] = useState<Product[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newProduct: Product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === newProduct.id);
            const maxStock = parseInt(newProduct.existencias);

            if (existingProduct) {
                const newQuantity = existingProduct.cantidad + newProduct.cantidad;
                if (newQuantity > maxStock) {
                    toast.error(`Solo hay ${maxStock} unidades disponibles`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.id === newProduct.id
                        ? { ...item, cantidad: newQuantity }
                        : item
                );
            } else {
                if (newProduct.cantidad > maxStock) {
                    toast.error(`Solo hay ${maxStock} unidades disponibles`);
                    return prevCart;
                }
                return [...prevCart, newProduct];
            }
        });
    };

    const updateQuantity = (id: string, newQuantity: number) => {
        setCart((prevCart) => {
            const item = prevCart.find(item => item.id === id);
            if (!item) return prevCart;

            const maxStock = parseInt(item.existencias);
            if (newQuantity > maxStock) {
                toast.error(`Solo hay ${maxStock} unidades disponibles`);
                return prevCart.map(item =>
                    item.id === id ? { ...item, cantidad: maxStock } : item
                );
            }

            return prevCart.map(item =>
                item.id === id ? { ...item, cantidad: newQuantity } : item
            );
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
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