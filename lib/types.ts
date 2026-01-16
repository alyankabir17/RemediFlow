// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  potency: string;
  form: string;
  image: string;
  sellingPrice: number;
  availability: 'in_stock' | 'out_of_stock';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  potency: string;
  form: string;
  image: string;
  sellingPrice: number;
  availability: 'in_stock' | 'out_of_stock';
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  notes?: string;
  productId: string;
  product?: Product;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  notes?: string;
  productId: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
