import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Product, Order, CustomerInfo, CartItem } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface StoreContextType {
  products: Product[]
  orders: Order[]
  addProduct: (product: Omit<Product, 'id'>, file: File | null) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>, file?: File | null) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  placeOrder: (items: CartItem[], customer: CustomerInfo) => Promise<void>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // -----------------------------
  // LOAD PRODUCTS
  // -----------------------------
  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (!error && data) setProducts(data)
  }, [])

  // -----------------------------
  // LOAD ORDERS
  // -----------------------------
  const loadOrders = useCallback(async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })

    if (!error && data) {
      const transformed = data.map((o) => ({
        id: o.id,
        items: o.items,
        customer: o.customer,
        total: Number(o.total),
        status: o.status,
        createdAt: o.created_at, // transform created_at → createdAt
      }))
      setOrders(transformed)
    }
  }, [])

  useEffect(() => {
    loadProducts()
    loadOrders()
  }, [loadProducts, loadOrders])

  // -----------------------------
  // UPLOAD IMAGE TO SUPABASE STORAGE
  // -----------------------------
  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()
    const fileName = `product-${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { upsert: false })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    console.log("Public URL data:", data)

    return data.publicUrl
  }

  // -----------------------------
  // ADD PRODUCT
  // -----------------------------
  const addProduct = useCallback(
    async (product: Omit<Product, 'id'>, file: File | null) => {
      let imageUrl = product.image

      if (file) {
        imageUrl = await uploadImage(file)
      }

      const { error } = await supabase.from('products').insert({
        ...product,
        image: imageUrl,
      })

      if (error) throw error
      loadProducts()
    },
    [loadProducts]
  )

  // -----------------------------
  // UPDATE PRODUCT
  // -----------------------------
  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>, file?: File | null) => {
      let imageUrl = updates.image

      if (file) {
        imageUrl = await uploadImage(file)
      }

      const { error } = await supabase
        .from('products')
        .update({ ...updates, image: imageUrl })
        .eq('id', id)

      if (error) throw error
      loadProducts()
    },
    [loadProducts]
  )

  // -----------------------------
  // DELETE PRODUCT
  // -----------------------------
  const deleteProduct = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      loadProducts()
    },
    [loadProducts]
  )

  // -----------------------------
  // PLACE ORDER
  // -----------------------------
  const placeOrder = useCallback(
    async (items: CartItem[], customer: CustomerInfo) => {
      const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

      const { error } = await supabase.from('orders').insert({
        items,
        customer,
        total,
        status: 'pending',
      })

      if (error) throw error
      loadOrders()
    },
    [loadOrders]
  )

  // -----------------------------
  // UPDATE ORDER STATUS
  // -----------------------------
  const updateOrderStatus = useCallback(
    async (id: string, status: Order['status']) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id)
      if (error) throw error
      loadOrders()
    },
    [loadOrders]
  )

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}