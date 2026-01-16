/**
 * ADMIN API: Product Management
 * GET /api/admin/products - List all products (with sensitive data)
 * POST /api/admin/products - Create new product
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAdminProducts, createProduct } from '@/lib/services/product.service';
import { productQuerySchema, createProductSchema } from '@/lib/validations/backend';

// GET - List products (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);

    const query = productQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      isActive: searchParams.get('isActive') || undefined,
    });

    const result = await getAdminProducts(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[GET /api/admin/products] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create product (ADMIN)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const body = await request.json();

    // Validate request body
    const validatedData = createProductSchema.parse(body);

    // Create product
    const product = await createProduct(validatedData);

    return NextResponse.json(
      {
        data: product,
        success: true,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/admin/products] Error:', error);

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

    return NextResponse.json(
      {
        error: 'Failed to create product',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
