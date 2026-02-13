import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product, Order, CustomerInfo, CartItem } from '@/lib/types';
import { initialProducts } from '@/lib/data';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  placeOrder: (items: CartItem[], customer: CustomerInfo) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const placeOrder = useCallback((items: CartItem[], customer: CustomerInfo) => {
    const order: Order = {
      id: Date.now().toString(),
      items,
      customer,
      total: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, order]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  return (
    <StoreContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct, placeOrder, updateOrderStatus }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
