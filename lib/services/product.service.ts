/**
 * Product Service
 * Handles all product-related business logic
 */

import { prisma } from '../db';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../validations/backend';
import { getPublicStockStatus } from '../utils/stock';

/**
 * Get products for PUBLIC API
 * EXCLUDES: purchasePrice and other sensitive data
 */
export async function getPublicProducts(query: ProductQueryInput) {
  const { page, limit, category, search } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true, // Only show active products
  };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        potency: true,
        form: true,
        manufacturer: true,
        expiryDate: true,
        sellingPrice: true, // PUBLIC: Show selling price
        image: true,
        createdAt: true,
        updatedAt: true,
        // EXCLUDED: purchasePrice (sensitive)
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  // Add stock availability to each product
  const productsWithStock = await Promise.all(
    products.map(async (product: any) => ({
      ...product,
      availability: await getPublicStockStatus(product.id),
    }))
  );

  return {
    data: productsWithStock,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single product for PUBLIC API
 */
export async function getPublicProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      potency: true,
      form: true,
      manufacturer: true,
      expiryDate: true,
      sellingPrice: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return {
    ...product,
    availability: await getPublicStockStatus(product.id),
  };
}

/**
 * Get products for ADMIN API
 * INCLUDES: All fields including purchasePrice
 */
export async function getAdminProducts(query: ProductQueryInput) {
  const { page, limit, category, search, isActive } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single product for ADMIN API
 */
export async function getAdminProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
}

/**
 * Create new product (ADMIN only)
 */
export async function createProduct(data: CreateProductInput) {
  const product = await prisma.product.create({
    data: {
      ...data,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    },
  });

  return product;
}

/**
 * Update product (ADMIN only)
 */
export async function updateProduct(id: string, data: UpdateProductInput) {
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    },
  });

  return product;
}

/**
 * Soft delete product (ADMIN only)
 * Sets isActive to false instead of actual deletion
 */
export async function deleteProduct(id: string) {
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return product;
}
