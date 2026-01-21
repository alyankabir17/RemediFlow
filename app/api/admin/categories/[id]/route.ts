/**
 * ADMIN API: Category Management
 * PUT /api/admin/categories/[id] - Update category
 * DELETE /api/admin/categories/[id] - Delete category
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateCategory, deleteCategory, getCategory } from '@/lib/services/category.service';
import { updateCategorySchema } from '@/lib/validations/backend';

// GET - Get single category (ADMIN)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const category = await getCategory(params.id);

    return NextResponse.json({
      data: category,
      success: true,
    }, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/admin/categories/${params.id}] Error:`, error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Category not found',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch category',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}

// PUT - Update category (ADMIN)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const body = await request.json();

    // Validate request body
    const validatedData = updateCategorySchema.parse(body);

    // Update category
    const category = await updateCategory(params.id, validatedData);

    return NextResponse.json(
      {
        data: category,
        success: true,
        message: 'Category updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[PUT /api/admin/categories/${params.id}] Error:`, error);

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
          error: 'Category not found',
          success: false,
        },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        {
          error: 'Category name already exists',
          message: error.message,
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update category',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete category (ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    await deleteCategory(params.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Category deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[DELETE /api/admin/categories/${params.id}] Error:`, error);

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Category not found',
          success: false,
        },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes('existing products')) {
      return NextResponse.json(
        {
          error: 'Cannot delete category',
          message: error.message,
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete category',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
