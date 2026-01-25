/**
 * Test script for EmailJS email sending
 * Run with: npx ts-node scripts/test-email.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { sendOrderStatusEmail } from '../lib/services/email.service';

// ⚠️ CHANGE THIS to your real email address to receive the test email
const TEST_EMAIL = 'iamumair1124@gmail.com';

async function testEmailSend() {
  console.log('🧪 Testing EmailJS email sending...\n');
  
  // Check configuration
  console.log('📧 Configuration check:');
  console.log('  Service ID:', process.env.EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing');
  console.log('  Public Key:', process.env.EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
  console.log('  Private Key:', process.env.EMAILJS_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
  console.log('  Template (Confirmed):', process.env.EMAILJS_TEMPLATE_CONFIRMED || process.env.EMAILJS_TEMPLATE_ID || '❌ Missing');
  console.log('  Template (Cancelled):', process.env.EMAILJS_TEMPLATE_CANCELLED || '❌ Missing');
  console.log('');
  
  console.log(`📨 Sending test confirmation email to: ${TEST_EMAIL}\n`);
  
  try {
    await sendOrderStatusEmail('CONFIRMED', {
      customerName: 'Test User',
      email: TEST_EMAIL,
      orderNumber: 'TEST-123',
      productName: 'Sample Product',
      quantity: 2,
      totalAmount: 42.50,
      status: 'CONFIRMED',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=128',
    });
    
    console.log('✅ Confirmation email sent successfully!');
    console.log(`   Check your inbox at: ${TEST_EMAIL}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
  
  console.log('\n--- Testing cancellation email ---\n');
  
  try {
    await sendOrderStatusEmail('CANCELLED', {
      customerName: 'Test User',
      email: TEST_EMAIL,
      orderNumber: 'TEST-456',
      productName: 'Another Product',
      quantity: 1,
      totalAmount: 25.00,
      status: 'CANCELLED',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=128',
    });
    
    console.log('✅ Cancellation email sent successfully!');
    console.log(`   Check your inbox at: ${TEST_EMAIL}`);
  } catch (error) {
    console.error('❌ Failed to send cancellation email:', error);
  }
}

testEmailSend();
