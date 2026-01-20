/**
 * Email Service using EmailJS
 * Sends transactional emails for order updates
 */

import emailjs from '@emailjs/nodejs';

// Initialize EmailJS with your credentials
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '';

// Debug: Log configuration status
console.log('📧 EmailJS Configuration:', {
  serviceId: EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing',
  publicKey: EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing',
  privateKey: EMAILJS_PRIVATE_KEY ? '✅ Set' : '❌ Missing',
});

// Template IDs for different email types
// Falls back to main template if specific templates are not set
const EMAIL_TEMPLATES = {
  ORDER_CONFIRMED: process.env.EMAILJS_TEMPLATE_CONFIRMED || process.env.EMAILJS_TEMPLATE_ID || '',
  ORDER_CANCELLED: process.env.EMAILJS_TEMPLATE_CANCELLED || process.env.EMAILJS_TEMPLATE_ID || '',
  ORDER_SHIPPED: process.env.EMAILJS_TEMPLATE_SHIPPED || process.env.EMAILJS_TEMPLATE_ID || '',
  ORDER_DELIVERED: process.env.EMAILJS_TEMPLATE_DELIVERED || process.env.EMAILJS_TEMPLATE_ID || '',
};

console.log('📧 Email Templates:', {
  confirmed: EMAIL_TEMPLATES.ORDER_CONFIRMED ? '✅ Set' : '❌ Missing',
  cancelled: EMAIL_TEMPLATES.ORDER_CANCELLED ? '✅ Set' : '❌ Missing',
  shipped: EMAIL_TEMPLATES.ORDER_SHIPPED ? '✅ Set' : '❌ Missing',
  delivered: EMAIL_TEMPLATES.ORDER_DELIVERED ? '✅ Set' : '❌ Missing',
});

interface OrderEmailData {
  customerName: string;
  email: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: string;
  address?: string;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmedEmail(data: OrderEmailData): Promise<void> {
  console.log('📧 Attempting to send confirmation email to:', data.email);
  console.log('📧 Using template:', EMAIL_TEMPLATES.ORDER_CONFIRMED);
  
  // Match EmailJS template structure
  const emailData = {
    email: data.email,  // To Email field
    order_id: data.orderNumber,  // Order ID in subject
    orders: [
      {
        name: data.productName,
        units: data.quantity,
        price: data.totalAmount.toFixed(2),
      }
    ],
    cost: {
      shipping: '0.00',
      tax: '0.00',
      total: data.totalAmount.toFixed(2),
    }
  };
  
  console.log('📧 Email data:', emailData);
  
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAIL_TEMPLATES.ORDER_CONFIRMED,
      emailData,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );
    console.log(`✅ Confirmation email sent successfully to ${data.email}`);
    console.log('📧 EmailJS response:', response);
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

/**
 * Send order cancellation email
 */
export async function sendOrderCancelledEmail(data: OrderEmailData): Promise<void> {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAIL_TEMPLATES.ORDER_CANCELLED,
      {
        email: data.email,
        order_id: data.orderNumber,
        orders: [
          {
            name: data.productName,
            units: data.quantity,
            price: data.totalAmount.toFixed(2),
          }
        ],
        cost: {
          shipping: '0.00',
          tax: '0.00',
          total: data.totalAmount.toFixed(2),
        }
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );
    console.log(`✅ Cancellation email sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send cancellation email:', error);
    throw error;
  }
}

/**
 * Send order shipped email
 */
export async function sendOrderShippedEmail(data: OrderEmailData): Promise<void> {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAIL_TEMPLATES.ORDER_SHIPPED,
      {
        email: data.email,
        order_id: data.orderNumber,
        orders: [
          {
            name: data.productName,
            units: data.quantity,
            price: data.totalAmount.toFixed(2),
          }
        ],
        cost: {
          shipping: '0.00',
          tax: '0.00',
          total: data.totalAmount.toFixed(2),
        }
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );
    console.log(`✅ Shipping email sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send shipping email:', error);
    throw error;
  }
}

/**
 * Send order delivered email
 */
export async function sendOrderDeliveredEmail(data: OrderEmailData): Promise<void> {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAIL_TEMPLATES.ORDER_DELIVERED,
      {
        email: data.email,
        order_id: data.orderNumber,
        orders: [
          {
            name: data.productName,
            units: data.quantity,
            price: data.totalAmount.toFixed(2),
          }
        ],
        cost: {
          shipping: '0.00',
          tax: '0.00',
          total: data.totalAmount.toFixed(2),
        }
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );
    console.log(`✅ Delivery email sent to ${data.email}`);
  } catch (error) {
    console.error('❌ Failed to send delivery email:', error);
    throw error;
  }
}

/**
 * Main function to send email based on order status
 */
export async function sendOrderStatusEmail(
  status: string,
  orderData: OrderEmailData
): Promise<void> {
  // Skip if EmailJS is not configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('⚠️ EmailJS not configured. Skipping email notification.');
    return;
  }

  try {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        await sendOrderConfirmedEmail(orderData);
        break;
      case 'CANCELLED':
        await sendOrderCancelledEmail(orderData);
        break;
      case 'SHIPPED':
        await sendOrderShippedEmail(orderData);
        break;
      case 'DELIVERED':
        await sendOrderDeliveredEmail(orderData);
        break;
      default:
        console.log(`ℹ️ No email template configured for status: ${status}`);
    }
  } catch (error) {
    console.error('Failed to send order status email:', error);
    // Don't throw error - email failure shouldn't block order update
  }
}
