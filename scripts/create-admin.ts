/**
 * Script to create an admin user
 * Run: npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@remedyflow.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123'; // Change in production!
  const name = process.env.ADMIN_NAME || 'Admin User';

  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log('❌ Admin user already exists with email:', email);
      return;
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', password);
    console.log('⚠️  IMPORTANT: Change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
