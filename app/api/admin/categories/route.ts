/**
 * ADMIN API: Category Management
 * GET /api/admin/categories - List all categories
 * POST /api/admin/categories - Create new category
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCategories, createCategory } from '@/lib/services/category.service';
import { createCategorySchema } from '@/lib/validations/backend';

// GET - List categories (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = await getCategories(includeInactive);

    return NextResponse.json({
      data: categories,
      success: true,
    }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/admin/categories] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}

// POST - Create category (ADMIN)
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const body = await request.json();

    // Validate request body
    const validatedData = createCategorySchema.parse(body);

    // Create category
    const category = await createCategory(validatedData);

    return NextResponse.json(
      {
        data: category,
        success: true,
        message: 'Category created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/admin/categories] Error:', error);

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

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        {
          error: 'Category already exists',
          message: error.message,
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create category',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
