/**
 * Backend Validation Schemas using Zod
 * All API requests are validated against these schemas
 */

import { z } from 'zod';

// ============================================
// PRODUCT VALIDATION
// ============================================

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  category: z.string().min(1).max(100),
  potency: z.string().min(1).max(100),
  form: z.string().min(1).max(100),
  manufacturer: z.string().min(1).max(200),
  batchNumber: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
  sellingPrice: z.number().positive(),
  purchasePrice: z.number().positive(),
  image: z.string().url(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ============================================
// ORDER VALIDATION
// ============================================

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  address: z.string().min(10).max(1000),
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(10000),
  notes: z.string().max(1000).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'SHIPPED', 'DELIVERED']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ============================================
// PURCHASE VALIDATION
// ============================================

export const createPurchaseSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(1000000),
  purchasePrice: z.number().positive(),
  supplier: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  purchaseDate: z.string().datetime().optional(),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;

// ============================================
// SALE VALIDATION
// ============================================

export const createSaleSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(10000),
  salePrice: z.number().positive(),
  notes: z.string().max(1000).optional(),
  saleDate: z.string().datetime().optional(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;

// ============================================
// QUERY VALIDATION
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const productQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const orderQuerySchema = paginationSchema.extend({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'SHIPPED', 'DELIVERED']).optional(),
  email: z.string().email().optional(),
  productId: z.string().cuid().optional(),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
