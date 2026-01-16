/**
 * ADMIN API: Single Product Management
 * GET /api/admin/products/[id] - Get product details
 * PUT /api/admin/products/[id] - Update product
 * DELETE /api/admin/products/[id] - Soft delete product
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getAdminProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/services/product.service';
import { updateProductSchema } from '@/lib/validations/backend';

// GET - Get single product (ADMIN)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const product = await getAdminProduct(params.id);

      return NextResponse.json(
        {
          data: product,
          success: true,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(`[GET /api/admin/products/${params.id}] Error:`, error);

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

// PUT - Update product (ADMIN)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const body = await request.json();

      // Validate request body
      const validatedData = updateProductSchema.parse(body);

      // Update product
      const product = await updateProduct(params.id, validatedData);

      return NextResponse.json(
        {
          data: product,
          success: true,
          message: 'Product updated successfully',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(`[PUT /api/admin/products/${params.id}] Error:`, error);

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
          error: 'Failed to update product',
          message: error instanceof Error ? error.message : 'Unknown error',
          success: false,
        },
        { status: 500 }
      );
    }
  }

// DELETE - Soft delete product (ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const product = await deleteProduct(params.id);

      return NextResponse.json(
        {
          data: product,
          success: true,
          message: 'Product deleted successfully',
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(`[DELETE /api/admin/products/${params.id}] Error:`, error);

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
          error: 'Failed to delete product',
          message: error instanceof Error ? error.message : 'Unknown error',
          success: false,
        },
        { status: 500 }
      );
    }
  }
