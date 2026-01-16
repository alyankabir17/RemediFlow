'use client';

import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">RemedyFlow</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Products
          </Link>
          <Button asChild>
            <Link href="/products">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </nav>

        <Button asChild className="md:hidden">
          <Link href="/products">Products</Link>
        </Button>
      </div>
    </header>
  );
}
