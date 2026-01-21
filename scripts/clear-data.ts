/**
 * Clear Dummy Data Script
 * Deletes all Sale, Purchase, Order, Product, and Category records
 * Preserves Admin user
 * Run: npx ts-node scripts/clear-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
  console.log('🗑️  Starting data cleanup...\n');

  try {
    // Step 1: Delete Sales (depends on Orders and Products)
    console.log('Deleting Sales...');
    const deletedSales = await prisma.sale.deleteMany({});
    console.log(`✅ Deleted ${deletedSales.count} sale records\n`);

    // Step 2: Delete Orders (depends on Products)
    console.log('Deleting Orders...');
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`✅ Deleted ${deletedOrders.count} order records\n`);

    // Step 3: Delete Purchases (depends on Products)
    console.log('Deleting Purchases...');
    const deletedPurchases = await prisma.purchase.deleteMany({});
    console.log(`✅ Deleted ${deletedPurchases.count} purchase records\n`);

    // Step 4: Delete Products (depends on Categories)
    console.log('Deleting Products...');
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`✅ Deleted ${deletedProducts.count} product records\n`);

    // Step 5: Delete Categories (no dependencies)
    console.log('Deleting Categories...');
    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`✅ Deleted ${deletedCategories.count} category records\n`);

    console.log('🎉 Data cleanup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Sales deleted: ${deletedSales.count}`);
    console.log(`- Orders deleted: ${deletedOrders.count}`);
    console.log(`- Purchases deleted: ${deletedPurchases.count}`);
    console.log(`- Products deleted: ${deletedProducts.count}`);
    console.log(`- Categories deleted: ${deletedCategories.count}`);
    console.log('\n✅ Admin user preserved - you can still log in!\n');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

clearData()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
