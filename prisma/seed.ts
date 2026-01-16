/**
 * Database Seed Script
 * Populates database with sample data for testing
 * Run: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create admin user
  const hashedPassword = await hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@remedyflow.com' },
    update: {},
    create: {
      email: 'admin@remedyflow.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // 2. Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Paracetamol 500mg',
        description: 'Pain reliever and fever reducer',
        category: 'Analgesics',
        potency: '500mg',
        form: 'Tablet',
        manufacturer: 'PharmaCorp',
        batchNumber: 'PC2024001',
        expiryDate: new Date('2025-12-31'),
        sellingPrice: 5.99,
        purchasePrice: 3.50,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Amoxicillin 250mg',
        description: 'Antibiotic for bacterial infections',
        category: 'Antibiotics',
        potency: '250mg',
        form: 'Capsule',
        manufacturer: 'MediLife',
        batchNumber: 'ML2024002',
        expiryDate: new Date('2026-06-30'),
        sellingPrice: 12.99,
        purchasePrice: 8.50,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Vitamin C 1000mg',
        description: 'Immune system support supplement',
        category: 'Vitamins',
        potency: '1000mg',
        form: 'Tablet',
        manufacturer: 'HealthPlus',
        batchNumber: 'HP2024003',
        expiryDate: new Date('2026-03-31'),
        sellingPrice: 15.99,
        purchasePrice: 10.00,
        image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400',
      },
    }),
  ]);
  console.log('✅ Products created:', products.length);

  // 3. Create sample purchases (to add stock)
  const purchases = await Promise.all([
    prisma.purchase.create({
      data: {
        productId: products[0].id,
        quantity: 100,
        purchasePrice: 3.50,
        supplier: 'Wholesale Supplier A',
        notes: 'Initial stock purchase',
      },
    }),
    prisma.purchase.create({
      data: {
        productId: products[1].id,
        quantity: 50,
        purchasePrice: 8.50,
        supplier: 'Wholesale Supplier B',
        notes: 'Initial stock purchase',
      },
    }),
    prisma.purchase.create({
      data: {
        productId: products[2].id,
        quantity: 75,
        purchasePrice: 10.00,
        supplier: 'Wholesale Supplier A',
        notes: 'Initial stock purchase',
      },
    }),
  ]);
  console.log('✅ Purchases created:', purchases.length);

  // 4. Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St, New York, NY 10001',
        productId: products[0].id,
        quantity: 2,
        totalAmount: 11.98,
        status: 'PENDING',
      },
    }),
    prisma.order.create({
      data: {
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        productId: products[1].id,
        quantity: 1,
        totalAmount: 12.99,
        status: 'CONFIRMED',
      },
    }),
  ]);
  console.log('✅ Orders created:', orders.length);

  // 5. Create sale for confirmed order
  await prisma.sale.create({
    data: {
      productId: orders[1].productId,
      quantity: orders[1].quantity,
      salePrice: orders[1].totalAmount / orders[1].quantity,
      orderId: orders[1].id,
      notes: 'Sale from confirmed order',
    },
  });
  console.log('✅ Sale created for confirmed order');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('- Admin user: admin@remedyflow.com (password: admin123)');
  console.log('- Products: 3');
  console.log('- Purchases: 3');
  console.log('- Orders: 2 (1 pending, 1 confirmed)');
  console.log('- Sales: 1');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
