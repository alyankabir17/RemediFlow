'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Package, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';

interface PublicNavbarProps {
  categoryDrawer?: React.ReactNode;
}

export function PublicNavbar({ categoryDrawer }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const pathname = usePathname();
  const isProductsPage = pathname === '/products' || pathname?.startsWith('/products/');
  const cartItemCount = getTotalItems();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center justify-between px-2 sm:px-4">
          {/* Left side - Hamburger Menu for Categories */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Category Hamburger Menu - Always visible on left */}
            <Sheet open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="flex-shrink-0 ml-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                <SheetHeader className="p-6 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <Menu className="h-5 w-5 text-blue-600" />
                      Categories
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                  <SheetDescription>
                    Browse products by category
                  </SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-6 pt-4">
                  {categoryDrawer}
                </div>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RemedyFlow</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 mr-2">
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
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-0">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  <span className="text-xl font-bold">RemedyFlow</span>
                </SheetTitle>
                <SheetDescription>
                  Navigation menu
                </SheetDescription>
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
                <Link 
                  href="/cart" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 border-b flex items-center justify-between"
                >
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <Badge variant="destructive">{cartItemCount}</Badge>
                  )}
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
