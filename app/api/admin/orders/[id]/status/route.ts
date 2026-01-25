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
    console.log('\n========== ORDER STATUS ROUTE - EMAIL SECTION ==========');
    console.log('📧 Preparing email data...');
    console.log('📧 Order details:');
    console.log('   - Customer:', order.customerName);
    console.log('   - Email:', order.email);
    console.log('   - Order #:', order.orderNumber);
    console.log('   - Product:', order.product?.name || 'MISSING PRODUCT');
    console.log('   - Product Image:', order.product?.image || 'NO IMAGE');
    console.log('   - Quantity:', order.quantity);
    console.log('   - Total:', order.totalAmount);
    console.log('   - New Status:', validatedData.status);
    console.log('========================================================\n');
    
    if (!order.product) {
      console.error('❌ ERROR: order.product is undefined!');
    }
    
    const emailPayload = {
      customerName: order.customerName,
      email: order.email,
      orderNumber: order.orderNumber,
      productName: order.product?.name || 'Unknown Product',
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      status: validatedData.status,
      address: order.address,
      imageUrl: order.product?.image || '',
    };
    
    console.log('📧 Email payload:', JSON.stringify(emailPayload, null, 2));
    
    try {
      console.log('📧 Calling sendOrderStatusEmail...');
      await sendOrderStatusEmail(validatedData.status, emailPayload);
      console.log('✅ Email function completed successfully');
    } catch (emailError) {
      console.error('❌ Email notification failed:');
      console.error(emailError);
      if (emailError && typeof emailError === 'object') {
        console.error('Error JSON:', JSON.stringify(emailError, null, 2));
      }
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
