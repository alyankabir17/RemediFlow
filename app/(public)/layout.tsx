'use client';

import { PublicNavbar } from '@/components/public/navbar';
import { PublicFooter } from '@/components/public/footer';
import { DeliveryBanner } from '@/components/public/delivery-banner';
import { CategorySidebar } from '@/components/public/category-sidebar';
import { CartProvider } from '@/contexts/cart-context';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <DeliveryBanner />
        <PublicNavbar categoryDrawer={<CategorySidebar />} />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </CartProvider>
  );
}
