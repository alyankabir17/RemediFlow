'use client';

import { useState } from 'react';
import { X, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeliveryBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm md:text-base">
        <Truck className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-center">
          🎉 <strong>Free Delivery</strong> on orders over <strong>Rs 2,000+</strong> - Shop now!
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 h-6 w-6 md:h-8 md:w-8 text-white hover:bg-white/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
