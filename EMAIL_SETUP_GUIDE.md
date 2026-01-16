# RemedyFlow Email Notification Setup Guide

## 📧 EmailJS Configuration

This guide will help you set up email notifications for order status updates using EmailJS.

### Step 1: Create EmailJS Account

1. Visit [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Copy your **Service ID** - you'll need this later

### Step 3: Create Email Templates

Create 4 email templates for different order statuses:

#### Template 1: Order Confirmed
- Go to **Email Templates** → **Create New Template**
- Template Name: `Order Confirmed`
- Subject: `Order {{order_number}} Confirmed - RemedyFlow`
- Content:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #10b981;">Order Confirmed! 🎉</h2>
  
  <p>Hi {{to_name}},</p>
  
  <p>Great news! Your order has been confirmed and is being processed.</p>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Order Details:</h3>
    <p><strong>Order Number:</strong> {{order_number}}</p>
    <p><strong>Product:</strong> {{product_name}}</p>
    <p><strong>Quantity:</strong> {{quantity}}</p>
    <p><strong>Total Amount:</strong> ${{total_amount}}</p>
    <p><strong>Status:</strong> <span style="color: #10b981;">{{status}}</span></p>
  </div>
  
  <p>We'll notify you when your order ships.</p>
  
  <p>Thank you for shopping with RemedyFlow!</p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="color: #6b7280; font-size: 12px;">
    This is an automated email from RemedyFlow. Please do not reply to this email.
  </p>
</div>
```
- Save and copy the **Template ID**

#### Template 2: Order Cancelled
- Create another template with name: `Order Cancelled`
- Subject: `Order {{order_number}} Cancelled - RemedyFlow`
- Content:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #ef4444;">Order Cancelled</h2>
  
  <p>Hi {{to_name}},</p>
  
  <p>Your order has been cancelled as requested.</p>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Order Details:</h3>
    <p><strong>Order Number:</strong> {{order_number}}</p>
    <p><strong>Product:</strong> {{product_name}}</p>
    <p><strong>Quantity:</strong> {{quantity}}</p>
    <p><strong>Total Amount:</strong> ${{total_amount}}</p>
    <p><strong>Status:</strong> <span style="color: #ef4444;">{{status}}</span></p>
  </div>
  
  <p>If you have any questions, please contact our support team.</p>
  
  <p>Best regards,<br>RemedyFlow Team</p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="color: #6b7280; font-size: 12px;">
    This is an automated email from RemedyFlow. Please do not reply to this email.
  </p>
</div>
```

#### Template 3: Order Shipped
- Create template: `Order Shipped`
- Subject: `Order {{order_number}} Shipped - RemedyFlow`
- Content:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #3b82f6;">Order Shipped! 📦</h2>
  
  <p>Hi {{to_name}},</p>
  
  <p>Your order is on its way!</p>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Order Details:</h3>
    <p><strong>Order Number:</strong> {{order_number}}</p>
    <p><strong>Product:</strong> {{product_name}}</p>
    <p><strong>Quantity:</strong> {{quantity}}</p>
    <p><strong>Total Amount:</strong> ${{total_amount}}</p>
    <p><strong>Delivery Address:</strong> {{address}}</p>
    <p><strong>Status:</strong> <span style="color: #3b82f6;">{{status}}</span></p>
  </div>
  
  <p>Your order should arrive within 3-5 business days.</p>
  
  <p>Thank you for your patience!</p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="color: #6b7280; font-size: 12px;">
    This is an automated email from RemedyFlow. Please do not reply to this email.
  </p>
</div>
```

#### Template 4: Order Delivered
- Create template: `Order Delivered`
- Subject: `Order {{order_number}} Delivered - RemedyFlow`
- Content:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #10b981;">Order Delivered! ✅</h2>
  
  <p>Hi {{to_name}},</p>
  
  <p>Your order has been successfully delivered!</p>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Order Details:</h3>
    <p><strong>Order Number:</strong> {{order_number}}</p>
    <p><strong>Product:</strong> {{product_name}}</p>
    <p><strong>Quantity:</strong> {{quantity}}</p>
    <p><strong>Total Amount:</strong> ${{total_amount}}</p>
    <p><strong>Status:</strong> <span style="color: #10b981;">{{status}}</span></p>
  </div>
  
  <p>We hope you enjoy your purchase! If you have any issues, please contact us.</p>
  
  <p>Thank you for choosing RemedyFlow!</p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="color: #6b7280; font-size: 12px;">
    This is an automated email from RemedyFlow. Please do not reply to this email.
  </p>
</div>
```

### Step 4: Get API Keys

1. Go to **Account** → **General** in EmailJS dashboard
2. Copy your **Public Key**
3. Copy your **Private Key** (keep this secret!)

### Step 5: Update Environment Variables

Update your `.env` file with the credentials:

```env
# EmailJS Configuration
EMAILJS_SERVICE_ID="service_xxxxxxx"
EMAILJS_PUBLIC_KEY="your_public_key_here"
EMAILJS_PRIVATE_KEY="your_private_key_here"
EMAILJS_TEMPLATE_CONFIRMED="template_xxxxxxx"
EMAILJS_TEMPLATE_CANCELLED="template_xxxxxxx"
EMAILJS_TEMPLATE_SHIPPED="template_xxxxxxx"
EMAILJS_TEMPLATE_DELIVERED="template_xxxxxxx"
```

### Step 6: Test Email Notifications

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Log in to admin dashboard
3. Navigate to Orders
4. Update an order status to CONFIRMED, SHIPPED, or DELIVERED
5. Check the customer's email inbox

### Email Template Variables

The following variables are automatically populated in your email templates:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_number}}` - Unique order number
- `{{product_name}}` - Product name
- `{{quantity}}` - Order quantity
- `{{total_amount}}` - Total order amount (formatted)
- `{{status}}` - Current order status
- `{{address}}` - Delivery address (for shipped emails)

### Free Tier Limits

EmailJS free tier includes:
- ✅ 200 emails per month
- ✅ 2 email templates
- ✅ 1 email service

For more emails, upgrade to a paid plan.

### Troubleshooting

**Emails not sending?**
1. Check that all environment variables are set correctly
2. Verify your EmailJS service is connected and active
3. Check the server console for error messages
4. Ensure your email service allows SMTP access
5. Check EmailJS dashboard for delivery logs

**Template not working?**
1. Make sure template IDs match exactly
2. Test templates in EmailJS dashboard first
3. Verify all variables are spelled correctly (case-sensitive)

### Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/contact/

---

🎉 **That's it!** Your customers will now receive email notifications when you update their order status.
