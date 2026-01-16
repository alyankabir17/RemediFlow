/**
 * Purchase Service
 * Handles purchase records and stock increases
 * 
 * CRITICAL BUSINESS RULE:
 * Purchases INCREASE stock
 */

import { prisma } from '../db';
import { CreatePurchaseInput } from '../validations/backend';

/**
 * Create new purchase (ADMIN only)
 * Increases stock for the product
 */
export async function createPurchase(data: CreatePurchaseInput) {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Create purchase record
  const purchase = await prisma.purchase.create({
    data: {
      ...data,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          purchasePrice: true,
        },
      },
    },
  });

  return purchase;
}

/**
 * Get all purchases (ADMIN only)
 */
export async function getPurchases(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [purchases, total] = await Promise.all([
    prisma.purchase.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            purchasePrice: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { purchaseDate: 'desc' },
    }),
    prisma.purchase.count(),
  ]);

  return {
    data: purchases,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single purchase (ADMIN only)
 */
export async function getPurchase(id: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });

  if (!purchase) {
    throw new Error('Purchase not found');
  }

  return purchase;
}

/**
 * Get purchase statistics (ADMIN only)
 */
export async function getPurchaseStats() {
  const [totalPurchases, totalCost, todayPurchases] = await Promise.all([
    prisma.purchase.count(),
    prisma.purchase.aggregate({
      _sum: { purchasePrice: true },
    }),
    prisma.purchase.count({
      where: {
        purchaseDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return {
    totalPurchases,
    totalCost: totalCost._sum.purchasePrice || 0,
    todayPurchases,
  };
}
