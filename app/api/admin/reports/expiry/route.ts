/**
 * ADMIN API: Expiry Alerts Report
 * GET /api/admin/reports/expiry
 * 
 * Provides alerts for products nearing expiry
 * Severity levels:
 * - Critical: <= 30 days
 * - Warning: <= 60 days
 * - Notice: <= 90 days
 * 
 * Protected: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getExpiryAlerts } from '@/lib/utils/stock';

// GET - Expiry alerts (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);
    
    // Days to look ahead (default 90)
    const days = parseInt(searchParams.get('days') || '90');

    const alerts = await getExpiryAlerts(days);

    // Group by severity
    const grouped = {
      critical: alerts.filter((a) => a.severity === 'critical'),
      warning: alerts.filter((a) => a.severity === 'warning'),
      notice: alerts.filter((a) => a.severity === 'notice'),
    };

    return NextResponse.json(
      {
        data: alerts,
        grouped,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/admin/reports/expiry] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate expiry report',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
