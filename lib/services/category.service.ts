/**
 * Category Service
 * Handles category-related business logic
 */

import { prisma } from '../db';
import { CreateCategoryInput, UpdateCategoryInput } from '../validations/backend';

/**
 * Get all categories (PUBLIC and ADMIN)
 */
export async function getCategories(includeInactive = false) {
  const where: any = {};
  
  if (!includeInactive) {
    where.isActive = true;
  }

  const categories = await prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories;
}

/**
 * Get single category
 */
export async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
}

/**
 * Create new category (ADMIN only)
 */
export async function createCategory(data: CreateCategoryInput) {
  // Check if category with same name exists
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new Error('Category with this name already exists');
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      isActive: data.isActive ?? true,
    },
  });

  return category;
}

/**
 * Update category (ADMIN only)
 */
export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  // Check name uniqueness if name is being updated
  if (data.name && data.name !== category.name) {
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new Error('Category with this name already exists');
    }
  }

  const updated = await prisma.category.update({
    where: { id },
    data,
  });

  return updated;
}

/**
 * Delete category (ADMIN only)
 * Soft delete - checks if category has products
 */
export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  if (category._count.products > 0) {
    throw new Error('Cannot delete category with existing products. Please reassign or remove products first.');
  }

  await prisma.category.delete({
    where: { id },
  });

  return { success: true };
}
