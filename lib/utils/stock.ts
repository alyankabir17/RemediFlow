/**
 * Stock Calculation Utilities
 * 
 * CRITICAL BUSINESS RULE:
 * Stock = Total Purchases - Total Confirmed Sales
 * Stock is NEVER stored in database, always calculated in real-time
 */

import { prisma } from '../db';

export interface StockInfo {
  productId: string;
  productName: string;
  totalPurchases: number;
  totalSales: number;
  currentStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface ExpiryAlert {
  productId: string;
  productName: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  currentStock: number;
  severity: 'critical' | 'warning' | 'notice';
}

/**
 * Calculate current stock for a specific product
 */
export async function calculateProductStock(productId: string): Promise<number> {
  // Get total purchases
  const purchases = await prisma.purchase.aggregate({
    where: { productId },
    _sum: { quantity: true },
  });

  // Get total confirmed sales
  const sales = await prisma.sale.aggregate({
    where: { productId },
    _sum: { quantity: true },
  });

  const totalPurchases = purchases._sum.quantity || 0;
  const totalSales = sales._sum.quantity || 0;

  return totalPurchases - totalSales;
}

/**
 * Calculate stock for all products
 */
export async function calculateAllStock(): Promise<StockInfo[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
  });

  const stockInfoPromises = products.map(async (product) => {
    const purchases = await prisma.purchase.aggregate({
      where: { productId: product.id },
      _sum: { quantity: true },
    });

    const sales = await prisma.sale.aggregate({
      where: { productId: product.id },
      _sum: { quantity: true },
    });

    const totalPurchases = purchases._sum.quantity || 0;
    const totalSales = sales._sum.quantity || 0;
    const currentStock = totalPurchases - totalSales;

    return {
      productId: product.id,
      productName: product.name,
      totalPurchases,
      totalSales,
      currentStock,
      isLowStock: currentStock > 0 && currentStock <= 10,
      isOutOfStock: currentStock <= 0,
    };
  });

  return Promise.all(stockInfoPromises);
}

/**
 * Get low stock alerts
 * Products with stock <= threshold
 */
export async function getLowStockAlerts(threshold: number = 10): Promise<StockInfo[]> {
  const allStock = await calculateAllStock();
  return allStock.filter(
    (stock) => stock.currentStock > 0 && stock.currentStock <= threshold
  );
}

/**
 * Get out of stock products
 */
export async function getOutOfStockProducts(): Promise<StockInfo[]> {
  const allStock = await calculateAllStock();
  return allStock.filter((stock) => stock.currentStock <= 0);
}

/**
 * Get expiry alerts
 * Products expiring within specified days
 */
export async function getExpiryAlerts(
  days: number = 90
): Promise<ExpiryAlert[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const expiringProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      expiryDate: {
        lte: futureDate,
        gte: new Date(),
      },
    },
    select: {
      id: true,
      name: true,
      expiryDate: true,
    },
  });

  const alertsPromises = expiringProducts.map(async (product) => {
    if (!product.expiryDate) return null;

    const stock = await calculateProductStock(product.id);
    const daysUntilExpiry = Math.ceil(
      (product.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    let severity: 'critical' | 'warning' | 'notice';
    if (daysUntilExpiry <= 30) severity = 'critical';
    else if (daysUntilExpiry <= 60) severity = 'warning';
    else severity = 'notice';

    return {
      productId: product.id,
      productName: product.name,
      expiryDate: product.expiryDate,
      daysUntilExpiry,
      currentStock: stock,
      severity,
    };
  });

  const alerts = await Promise.all(alertsPromises);
  return alerts.filter((alert): alert is ExpiryAlert => alert !== null);
}

/**
 * Check if sufficient stock exists for a sale
 */
export async function hasSufficientStock(
  productId: string,
  requestedQuantity: number
): Promise<boolean> {
  const currentStock = await calculateProductStock(productId);
  return currentStock >= requestedQuantity;
}

/**
 * Get stock status for public display
 * Returns: 'in_stock' | 'out_of_stock'
 */
export async function getPublicStockStatus(
  productId: string
): Promise<'in_stock' | 'out_of_stock'> {
  const stock = await calculateProductStock(productId);
  return stock > 0 ? 'in_stock' : 'out_of_stock';
}
