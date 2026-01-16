/**
 * PUBLIC API: Get single product
 * GET /api/products/[id]
 * 
 * No authentication required
 * Excludes sensitive data like purchasePrice
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicProduct } from '@/lib/services/product.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getPublicProduct(params.id);

    return NextResponse.json(
      {
        data: product,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[GET /api/products/${params.id}] Error:`, error);

    if (error instanceof Error && error.message === 'Product not found') {
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
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
