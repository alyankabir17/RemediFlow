'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Package, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface PublicNavbarProps {
  categoryDrawer?: React.ReactNode;
}

export function PublicNavbar({ categoryDrawer }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isProductsPage = pathname === '/products' || pathname?.startsWith('/products/');

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Category Drawer Toggle - Only show on products page for mobile */}
            {isProductsPage && categoryDrawer && (
              <div className="lg:hidden">
                {categoryDrawer}
              </div>
            )}
            
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RemedyFlow</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  <span className="text-xl font-bold">RemedyFlow</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col space-y-4">
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 border-b"
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 border-b"
                >
                  Products
                </Link>
                <Button asChild className="w-full mt-4">
                  <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Browse Products
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
