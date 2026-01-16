/**
 * ADMIN API: Stock Report
 * GET /api/admin/reports/stock
 * 
 * Provides detailed stock information for all products
 * Includes:
 * - Current stock levels
 * - Low stock alerts
 * - Out of stock products
 * - Stock calculations (Purchases - Sales)
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  calculateAllStock,
  getLowStockAlerts,
  getOutOfStockProducts,
} from '@/lib/utils/stock';

// GET - Stock report (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'all';

    let data;

    switch (reportType) {
      case 'low-stock':
        // Products with low stock
        const threshold = parseInt(searchParams.get('threshold') || '10');
        data = await getLowStockAlerts(threshold);
        break;

      case 'out-of-stock':
        // Products with no stock
        data = await getOutOfStockProducts();
        break;

      case 'all':
      default:
        // All products with stock info
        data = await calculateAllStock();
        break;
    }

    return NextResponse.json(
      {
        data,
        reportType,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/admin/reports/stock] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate stock report',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
