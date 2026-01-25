/**
 * ADMIN API: Order Management
 * GET /api/admin/orders - List all orders
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getOrders } from '@/lib/services/order.service';
import { orderQuerySchema } from '@/lib/validations/backend';

// GET - List orders (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);

    const query = orderQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      status: searchParams.get('status') || undefined,
      email: searchParams.get('email') || undefined,
      productId: searchParams.get('productId') || undefined,
    });

    const result = await getOrders(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[GET /api/admin/orders] Error:', errorMessage);

    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
