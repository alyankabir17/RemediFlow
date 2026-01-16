/**
 * Order Service
 * Handles order creation and management
 * 
 * CRITICAL BUSINESS RULES:
 * 1. Orders can be created WITHOUT authentication (public)
 * 2. Creating an order does NOT affect stock
 * 3. Only CONFIRMED orders generate sales and affect stock
 */

import { prisma } from '../db';
import { CreateOrderInput, UpdateOrderStatusInput, OrderQueryInput } from '../validations/backend';
import { hasSufficientStock } from '../utils/stock';
import { createSaleFromOrder } from './sale.service';

/**
 * Create new order (PUBLIC API)
 * No authentication required
 * Does NOT affect stock immediately
 */
export async function createOrder(data: CreateOrderInput) {
  // Verify product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: data.productId, isActive: true },
  });

  if (!product) {
    throw new Error('Product not found or inactive');
  }

  // Calculate total amount based on current selling price
  const totalAmount = product.sellingPrice * data.quantity;

  // Create order with PENDING status
  const order = await prisma.order.create({
    data: {
      ...data,
      totalAmount,
      status: 'PENDING',
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sellingPrice: true,
          image: true,
        },
      },
    },
  });

  return order;
}

/**
 * Get all orders (ADMIN only)
 */
export async function getOrders(query: OrderQueryInput) {
  const { page, limit, status, email, productId } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (email) {
    where.email = { contains: email, mode: 'insensitive' };
  }

  if (productId) {
    where.productId = productId;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            sellingPrice: true,
          },
        },
        sale: true, // Include linked sale if exists
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single order (ADMIN only)
 */
export async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      product: true,
      sale: true,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
}

/**
 * Update order status (ADMIN only)
 * 
 * CRITICAL: When status changes to CONFIRMED:
 * 1. Check if sufficient stock exists
 * 2. Create a Sale record
 * 3. Stock is automatically reduced by the sale
 */
export async function updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { sale: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Prevent re-confirming an already confirmed order
  if (order.status === 'CONFIRMED' && data.status === 'CONFIRMED') {
    throw new Error('Order is already confirmed');
  }

  // If confirming order, check stock and create sale
  if (data.status === 'CONFIRMED' && order.status !== 'CONFIRMED') {
    // Check if a sale already exists (in case re-confirming a previously confirmed order)
    if (order.sale) {
      // Sale already exists, just update order status
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: data.status },
        include: {
          product: true,
          sale: true,
        },
      });
      return updatedOrder;
    }

    // Check if sufficient stock exists
    const hasStock = await hasSufficientStock(order.productId, order.quantity);

    if (!hasStock) {
      throw new Error('Insufficient stock to confirm order');
    }

    // Use transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: data.status },
        include: {
          product: true,
        },
      });

      // Create sale record (this reduces stock)
      await createSaleFromOrder(updatedOrder, tx as any);

      return updatedOrder;
    });
  }

  // For other status updates, just update the order
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: data.status },
    include: {
      product: true,
      sale: true,
    },
  });

  return updatedOrder;
}

/**
 * Get order statistics (ADMIN only)
 */
export async function getOrderStats() {
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    cancelledOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'CONFIRMED' } }),
    prisma.order.count({ where: { status: 'CANCELLED' } }),
    prisma.order.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    cancelledOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
  };
}
