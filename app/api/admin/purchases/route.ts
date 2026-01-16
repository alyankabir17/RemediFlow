/**
 * ADMIN API: Purchases Management
 * POST /api/admin/purchases - Create purchase record
 * GET /api/admin/purchases - List purchases
 * 
 * Protected: Requires authentication
 * Purchases INCREASE stock
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createPurchase, getPurchases } from '@/lib/services/purchase.service';
import { createPurchaseSchema, paginationSchema } from '@/lib/validations/backend';

// POST - Create purchase (ADMIN)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const body = await request.json();

    // Validate request body
    const validatedData = createPurchaseSchema.parse(body);

    // Create purchase
    const purchase = await createPurchase(validatedData);

    return NextResponse.json(
      {
        data: purchase,
        success: true,
        message: 'Purchase recorded successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/admin/purchases] Error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error,
          success: false,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Product not found',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create purchase',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}

// GET - List purchases (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);

    const query = paginationSchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
    });

    const result = await getPurchases(query.page, query.limit);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[GET /api/admin/purchases] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch purchases',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
