// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  potency: string;
  form: string;
  manufacturer: string;
  batchNumber?: string;
  expiryDate?: string;
  image: string;
  sellingPrice: number;
  purchasePrice: number;
  isHot: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  availability?: 'in_stock' | 'out_of_stock';
  quantity?: number; // For cart/order context
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  categoryId: string;
  potency: string;
  form: string;
  manufacturer: string;
  batchNumber?: string;
  expiryDate?: string;
  image: string;
  sellingPrice: number;
  purchasePrice: number;
  isHot?: boolean;
  isBestSeller?: boolean;
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
