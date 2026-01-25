'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FolderOpen, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    products: number;
  };
}

interface CategorySidebarProps {
  className?: string;
  showHeader?: boolean;
}

export function CategorySidebar({ className, showHeader = true }: CategorySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('Loading categories...');
      const response = await fetch('/api/categories');
      console.log('Categories response status:', response.status);
      const data = await response.json();
      console.log('Categories data:', data);
      if (data.success) {
        setCategories(data.data);
        console.log('Categories loaded:', data.data.length);
      } else {
        console.error('Categories API returned success: false', data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedCategoryId === categoryId) {
      // Deselect if clicking the same category
      params.delete('categoryId');
    } else {
      params.set('categoryId', categoryId);
      params.set('page', '1'); // Reset to first page
    }
    
    router.push(`/products?${params.toString()}`);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categoryId');
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(showHeader && 'bg-white border rounded-lg p-4')}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              Categories
            </h3>
            {selectedCategoryId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilter}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No categories available
          </p>
        ) : (
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg transition-colors',
                    'hover:bg-blue-50 hover:text-blue-700',
                    selectedCategoryId === category.id
                      ? 'bg-blue-100 text-blue-700 font-bold border border-blue-300'
                      : 'text-gray-700 bg-gray-50'
                  )}
                >
                  <div>
                    <span className="text-sm font-bold">{category.name}</span>
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
