/**
 * ADMIN API: Dashboard Statistics
 * GET /api/admin/dashboard/stats
 * 
 * Provides overview statistics for admin dashboard
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getOrderStats } from '@/lib/services/order.service';
import { prisma } from '@/lib/db';

// GET - Dashboard stats (ADMIN)
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth();

    // Get order statistics
    const orderStats = await getOrderStats();

    // Get total products count
    const totalProducts = await prisma.product.count({
      where: { isActive: true },
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const stats = {
      totalOrders: orderStats.totalOrders,
      totalRevenue: orderStats.totalRevenue,
      totalProducts,
      pendingOrders: orderStats.pendingOrders,
      recentOrders,
    };

    return NextResponse.json(
      {
        data: stats,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/admin/dashboard/stats] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
