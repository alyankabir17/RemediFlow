/**
 * ADMIN API: Order Status Update
 * PATCH /api/admin/orders/[id]/status
 * 
 * CRITICAL: When status changes to CONFIRMED:
 * - Creates a Sale record
 * - Checks stock availability
 * - Deducts stock logically
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateOrderStatus } from '@/lib/services/order.service';
import { updateOrderStatusSchema } from '@/lib/validations/backend';
import { sendOrderStatusEmail } from '@/lib/services/email.service';

// PATCH - Update order status (ADMIN)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔵 Status update endpoint called for order:', params.id);
  
  try {
    await requireAuth();
    console.log('✅ Authentication passed');
    
    const body = await request.json();
    console.log('📦 Request body:', body);

    // Validate request body
    const validatedData = updateOrderStatusSchema.parse(body);
    console.log('✅ Validation passed:', validatedData);

    // Update order status (handles sale creation if confirming)
    const order = await updateOrderStatus(params.id, validatedData);
    console.log('✅ Order status updated:', order.status);

    // Send email notification to customer
    console.log('📧 Attempting to send email notification...');
    try {
      await sendOrderStatusEmail(validatedData.status, {
        customerName: order.customerName,
        email: order.email,
        orderNumber: order.orderNumber,
        productName: order.product.name,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        status: validatedData.status,
        address: order.address,
      });
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.error('❌ Email notification failed:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        data: order,
        success: true,
        message: 'Order status updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `[PATCH /api/admin/orders/${params.id}/status] Error:`,
      error
    );

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

    // Handle insufficient stock
    if (
      error instanceof Error &&
      error.message.includes('Insufficient stock')
    ) {
      return NextResponse.json(
        {
          error: 'Insufficient stock',
          message: error.message,
          success: false,
        },
        { status: 400 }
      );
    }

    // Handle already confirmed
    if (
      error instanceof Error &&
      error.message.includes('already confirmed')
    ) {
      return NextResponse.json(
        {
          error: 'Already confirmed',
          message: error.message,
          success: false,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: 'Order not found',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update order status',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
