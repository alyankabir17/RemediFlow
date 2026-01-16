/**
 * PUBLIC API: Create order
 * POST /api/orders
 * 
 * No authentication required - public users can place orders
 * Order creation does NOT affect stock
 * Stock is only affected when admin confirms the order
 */

import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/services/order.service';
import { createOrderSchema } from '@/lib/validations/backend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createOrderSchema.parse(body);

    // Create order
    const order = await createOrder(validatedData);

    return NextResponse.json(
      {
        data: order,
        success: true,
        message: 'Order placed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/orders] Error:', error);

    // Handle validation errors
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

    // Handle product not found
    if (error instanceof Error && error.message.includes('Product not found')) {
      return NextResponse.json(
        {
          error: 'Product not found or inactive',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
