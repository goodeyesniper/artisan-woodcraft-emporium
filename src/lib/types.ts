export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  status: 'pending' | 'processing' | 'fulfilled';
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}
