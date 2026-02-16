export interface Product {
  id: string
  name: string
  price: number
  image?: string
  category: string
  description?: string
  specs: Record<string, string>
  featured: boolean
  created_at?: string
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  customer: CustomerInfo
  total: number
  status: 'pending' | 'processing' | 'fulfilled'
  createdAt: string
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}
