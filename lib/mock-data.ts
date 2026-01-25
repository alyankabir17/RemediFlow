// Mock data for development and testing
// This file can be used to create mock API responses or seed data

import { Product, Order, OrderStatus } from './types';

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer. Effective for mild to moderate pain relief.',
    categoryId: 'cat-1',
    potency: '500mg',
    form: 'Tablet',
    manufacturer: 'PharmaCorp',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    sellingPrice: 5.99,
    purchasePrice: 2.99,
    isHot: true,
    isBestSeller: false,
    isActive: true,
    availability: 'in_stock',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic used to treat bacterial infections. Take as prescribed by your doctor.',
    categoryId: 'cat-2',
    potency: '250mg',
    form: 'Capsule',
    manufacturer: 'MediLabs',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    sellingPrice: 12.99,
    purchasePrice: 6.49,
    isHot: false,
    isBestSeller: true,
    isActive: true,
    availability: 'in_stock',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory drug for pain relief and reducing inflammation.',
    categoryId: 'cat-1',
    potency: '400mg',
    form: 'Tablet',
    manufacturer: 'PharmaCorp',
    image: 'https://images.unsplash.com/photo-1550572017-4a23f1ed6c49?w=400',
    sellingPrice: 8.99,
    purchasePrice: 4.49,
    isHot: false,
    isBestSeller: false,
    isActive: true,
    availability: 'out_of_stock',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '4',
    name: 'Vitamin C 1000mg',
    description: 'Immune system support supplement. Water-soluble vitamin for daily health.',
    categoryId: 'cat-3',
    potency: '1000mg',
    form: 'Tablet',
    manufacturer: 'HealthPlus',
    image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400',
    sellingPrice: 15.99,
    purchasePrice: 7.99,
    isHot: true,
    isBestSeller: true,
    isActive: true,
    availability: 'in_stock',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '5',
    name: 'Omeprazole 20mg',
    description: 'Proton pump inhibitor for treating acid reflux and stomach ulcers.',
    categoryId: 'cat-2',
    potency: '20mg',
    form: 'Capsule',
    manufacturer: 'MediLabs',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
    sellingPrice: 18.99,
    purchasePrice: 9.49,
    isHot: false,
    isBestSeller: true,
    isActive: true,
    availability: 'in_stock',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '6',
    name: 'Cetirizine 10mg',
    description: 'Antihistamine for allergy relief. Non-drowsy formula for daily use.',
    categoryId: 'cat-1',
    potency: '10mg',
    form: 'Tablet',
    manufacturer: 'AllergyFree',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
    sellingPrice: 9.99,
    purchasePrice: 4.99,
    isHot: true,
    isBestSeller: false,
    isActive: true,
    availability: 'in_stock',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    quantity: 2,
    notes: 'Please deliver after 5 PM',
    productId: '1',
    product: mockProducts[0],
    status: 'PENDING',
    totalAmount: 11.98,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 234 567 8901',
    address: '456 Oak Ave, Suite 12, Los Angeles, CA 90001',
    quantity: 1,
    productId: '2',
    product: mockProducts[1],
    status: 'CONFIRMED',
    totalAmount: 12.99,
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
  },
  {
    id: 'ORD-003',
    customerName: 'Bob Johnson',
    email: 'bob.j@example.com',
    phone: '+1 234 567 8902',
    address: '789 Pine Rd, Chicago, IL 60601',
    quantity: 3,
    notes: 'Urgent delivery needed',
    productId: '4',
    product: mockProducts[3],
    status: 'SHIPPED',
    totalAmount: 47.97,
    createdAt: '2024-01-19T10:20:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: 'ORD-004',
    customerName: 'Alice Williams',
    email: 'alice.w@example.com',
    phone: '+1 234 567 8903',
    address: '321 Elm St, Houston, TX 77001',
    quantity: 2,
    productId: '5',
    product: mockProducts[4],
    status: 'SHIPPED',
    totalAmount: 37.98,
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-19T14:30:00Z',
  },
  {
    id: 'ORD-005',
    customerName: 'Charlie Brown',
    email: 'charlie.b@example.com',
    phone: '+1 234 567 8904',
    address: '654 Maple Dr, Phoenix, AZ 85001',
    quantity: 1,
    productId: '6',
    product: mockProducts[5],
    status: 'DELIVERED',
    totalAmount: 9.99,
    createdAt: '2024-01-17T16:30:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats = {
  totalOrders: 245,
  totalRevenue: 4523.89,
  totalProducts: 42,
  pendingOrders: 18,
  recentOrders: mockOrders.slice(0, 5),
};

// Helper function to generate paginated response
export function createPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  };
}

// Helper function to create API response
export function createApiResponse<T>(data: T, success: boolean = true, message?: string) {
  return {
    data,
    success,
    message,
  };
}

// Status progression helper
export const statusProgression: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

// Export all for easy importing
export default {
  products: mockProducts,
  orders: mockOrders,
  dashboardStats: mockDashboardStats,
  createPaginatedResponse,
  createApiResponse,
  statusProgression,
};
