'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/public/product-card';
import { OrderFormDialog } from '@/components/public/order-form-dialog';
import { CategorySidebar } from '@/components/public/category-sidebar';
import { MobileCategoryDrawer } from '@/components/public/mobile-category-drawer';
import { Product } from '@/lib/types';
import { publicApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') || '1');
    setPage(currentPage);
    loadProducts(currentPage);
  }, [searchParams]);

  const loadProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const categoryParam = categoryId ? `&categoryId=${categoryId}` : '';
      const response = await fetch(`/api/products?page=${pageNum}&limit=12${categoryParam}`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to load products');
      }
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse our selection of quality pharmaceutical products
            </p>
          </div>
          {/* Mobile Category Filter Button */}
          <div className="lg:hidden">
            <MobileCategoryDrawer />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Category Sidebar - Only visible on desktop */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <CategorySidebar />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available in this category at the moment.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOrderClick={setSelectedProduct}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', String(Math.max(1, page - 1)));
                      window.location.search = params.toString();
                    }}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', String(Math.min(totalPages, page + 1)));
                      window.location.search = params.toString();
                    }}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <OrderFormDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
