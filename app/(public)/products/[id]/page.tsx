'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { publicApi } from '@/lib/api';
import { OrderFormDialog } from '@/components/public/order-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await publicApi.getProduct(params.id as string);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error || 'Product not found'}
        </div>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  const isInStock = product.availability === 'in_stock';

  return (
    <div className="container mx-auto px-4 py-12">
      <Button asChild className="mb-6" variant="outline">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant={isInStock ? 'default' : 'secondary'}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-gray-900 mb-6">
            {formatCurrency(product.sellingPrice)}
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Potency</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.potency}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Form</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.form}
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setShowOrderForm(true)}
            disabled={!isInStock}
            className="w-full md:w-auto"
          >
            {isInStock ? 'Book Order' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      <OrderFormDialog
        product={product}
        open={showOrderForm}
        onClose={() => setShowOrderForm(false)}
      />
    </div>
  );
}
