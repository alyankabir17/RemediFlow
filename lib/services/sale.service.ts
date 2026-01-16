/**
 * Sale Service
 * Handles sale creation and management
 * 
 * CRITICAL BUSINESS RULES:
 * 1. Sales DECREASE stock
 * 2. Sales can be created:
 *    - Automatically from confirmed orders
 *    - Manually by admin
 * 3. Sales are immutable (no deletion)
 */

import { prisma } from '../db';
import { CreateSaleInput } from '../validations/backend';
import { hasSufficientStock } from '../utils/stock';
import { Order, PrismaClient } from '@prisma/client';

/**
 * Create sale from confirmed order
 * Called automatically when order status changes to CONFIRMED
 * 
 * @param order - The confirmed order
 * @param tx - Optional Prisma transaction client
 */
export async function createSaleFromOrder(
  order: Order,
  tx?: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>
) {
  const db = tx || prisma;

  // Check if sale already exists for this order
  const existingSale = await db.sale.findUnique({
    where: { orderId: order.id },
  });

  if (existingSale) {
    throw new Error('Sale already exists for this order');
  }

  // Create sale record
  const sale = await db.sale.create({
    data: {
      productId: order.productId,
      quantity: order.quantity,
      salePrice: order.totalAmount / order.quantity, // Unit price
      orderId: order.id,
      notes: `Sale from order ${order.orderNumber}`,
    },
  });

  return sale;
}

/**
 * Create manual sale (ADMIN only)
 * For sales not linked to orders (e.g., walk-in customers)
 */
export async function createManualSale(data: CreateSaleInput) {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Check if sufficient stock exists
  const hasStock = await hasSufficientStock(data.productId, data.quantity);

  if (!hasStock) {
    throw new Error('Insufficient stock for this sale');
  }

  // Create sale
  const sale = await prisma.sale.create({
    data: {
      ...data,
      saleDate: data.saleDate ? new Date(data.saleDate) : new Date(),
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sellingPrice: true,
        },
      },
    },
  });

  return sale;
}

/**
 * Get all sales (ADMIN only)
 */
export async function getSales(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sellingPrice: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { saleDate: 'desc' },
    }),
    prisma.sale.count(),
  ]);

  return {
    data: sales,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single sale (ADMIN only)
 */
export async function getSale(id: string) {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      product: true,
      order: true,
    },
  });

  if (!sale) {
    throw new Error('Sale not found');
  }

  return sale;
}

/**
 * Get sales statistics (ADMIN only)
 */
export async function getSalesStats() {
  const [totalSales, totalRevenue, todaySales] = await Promise.all([
    prisma.sale.count(),
    prisma.sale.aggregate({
      _sum: { salePrice: true },
    }),
    prisma.sale.count({
      where: {
        saleDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return {
    totalSales,
    totalRevenue: totalRevenue._sum.salePrice || 0,
    todaySales,
  };
}
