import { z } from 'zod';

// Order Form Validation
export const orderFormSchema = z.object({
  customerName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  address: z.string().min(20, 'Please provide complete address with city, area, and street details').max(1000),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(1000),
  notes: z.string().max(500).optional(),
  productId: z.string().min(1, 'Product is required'),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

// Product Form Validation (Admin)
export const productFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  categoryId: z.string().min(1, 'Category is required'),
  potency: z.string().min(1, 'Potency is required').max(100),
  form: z.string().min(1, 'Form is required').max(100),
  manufacturer: z.string().min(1, 'Manufacturer is required').max(200),
  batchNumber: z.string().max(100).optional(),
  expiryDate: z.string().optional().transform(val => val === '' ? undefined : val),
  image: z.string().min(1, 'Image is required').refine(
    (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image/'),
    'Must be a valid URL or uploaded image'
  ),
  sellingPrice: z.number().min(0.01, 'Selling price must be greater than 0'),
  purchasePrice: z.number().min(0.01, 'Purchase price must be greater than 0'),
  isHot: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// Order Status Update Validation (Admin)
export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export type OrderStatusValues = z.infer<typeof orderStatusSchema>;
