/**
 * Middleware for Route Protection
 * Protects /admin routes (requires authentication)
 * Public routes remain accessible
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Additional logic can be added here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }
        // Require token for all other admin routes
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

// Protect all /admin routes and admin API routes
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
