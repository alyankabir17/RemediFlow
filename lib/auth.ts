/**
 * Authentication Utilities
 * Helper functions for protecting API routes
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth.config';
import { NextResponse } from 'next/server';

/**
 * Get current authenticated user session
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if user is authenticated (admin)
 * Returns session if authenticated, throws error if not
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Middleware helper for protecting API routes
 * Returns unauthorized response if not authenticated
 */
export async function withAuth(
  handler: (session: any, ...args: any[]) => Promise<NextResponse>
) {
  return async (...args: any[]) => {
    try {
      const session = await requireAuth();
      return await handler(session, ...args);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'You must be logged in to access this resource',
        },
        { status: 401 }
      );
    }
  };
}
