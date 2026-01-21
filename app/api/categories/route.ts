/**
 * PUBLIC API: Get all active categories
 * GET /api/categories
 * 
 * No authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/services/category.service';

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories(false); // Only active categories
    
    return NextResponse.json({
      data: categories,
      success: true,
    }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/categories] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}
