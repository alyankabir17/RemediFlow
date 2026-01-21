'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CategorySidebar } from './category-sidebar';

export function MobileCategoryDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filter by Category
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <CategorySidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}
