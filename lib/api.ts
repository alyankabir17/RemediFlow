import { Product, Order, CreateOrderInput, CreateProductInput, OrderStatus, PaginatedResponse, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Public API - Products
export const publicApi = {
  getProducts: async (page = 1, limit = 12): Promise<PaginatedResponse<Product>> => {
    return apiFetch<PaginatedResponse<Product>>(`/products?page=${page}&limit=${limit}`);
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>(`/products/${id}`);
  },

  createOrder: async (data: CreateOrderInput): Promise<ApiResponse<Order>> => {
    return apiFetch<ApiResponse<Order>>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Admin API - Products
export const adminProductApi = {
  getProducts: async (page = 1, limit = 10): Promise<PaginatedResponse<Product>> => {
    return apiFetch<PaginatedResponse<Product>>(`/admin/products?page=${page}&limit=${limit}`);
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>(`/admin/products/${id}`);
  },

  createProduct: async (data: CreateProductInput): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (id: string, data: Partial<CreateProductInput>): Promise<ApiResponse<Product>> => {
    return apiFetch<ApiResponse<Product>>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return apiFetch<ApiResponse<void>>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API - Orders
export const adminOrderApi = {
  getOrders: async (page = 1, limit = 10, status?: OrderStatus): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return apiFetch<PaginatedResponse<Order>>(`/admin/orders?${params}`);
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return apiFetch<ApiResponse<Order>>(`/admin/orders/${id}`);
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<ApiResponse<Order>> => {
    return apiFetch<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Admin API - Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: Order[];
}

export const adminDashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiFetch<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
  },
};
