/**
 * Backend API Response Types
 * Consistent response structure for all API endpoints
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  success: false;
  details?: any;
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

/**
 * Product with stock status (PUBLIC API)
 */
export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  potency: string;
  form: string;
  manufacturer: string;
  expiryDate: Date | null;
  sellingPrice: number; // PUBLIC
  // purchasePrice excluded
  image: string;
  availability: 'in_stock' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order status type
 */
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED';
