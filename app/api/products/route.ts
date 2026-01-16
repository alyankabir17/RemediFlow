/**
 * PUBLIC API: Get all products
 * GET /api/products
 * 
 * No authentication required
 * Excludes sensitive data like purchasePrice
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/services/product.service';
import { productQuerySchema } from '@/lib/validations/backend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const query = productQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
    });

    const result = await getPublicProducts(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[GET /api/products] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
