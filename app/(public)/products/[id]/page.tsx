'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { publicApi } from '@/lib/api';
import { OrderFormDialog } from '@/components/public/order-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, ShoppingCart, Package, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

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

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      return newQty < 1 ? 1 : newQty > 999 ? 999 : newQty;
    });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} × ${product.name} added to your cart`,
      });
    }
  };

  const handleBuyNow = () => {
    setShowOrderForm(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
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
    <div className="container mx-auto px-4 py-8">
      {/* Back to Products */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 right-4">
            <Badge variant={isInStock ? 'default' : 'secondary'} className="text-sm">
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(product.sellingPrice)}
            </p>
          </div>

          <Separator />

          {/* Product Info */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Potency</p>
                  <p className="font-medium text-gray-900">{product.potency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Form</p>
                  <p className="font-medium text-gray-900">{product.form}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manufacturer</p>
                  <p className="font-medium text-gray-900">{product.manufacturer}</p>
                </div>
                {product.category && (
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{product.category.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={!isInStock || quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={!isInStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={handleBuyNow}
              disabled={!isInStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <Package className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Continue Shopping */}
          <Button variant="ghost" asChild className="w-full">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>

      {/* Order Dialog */}
      {product && (
        <OrderFormDialog
          product={{ ...product, quantity }}
          open={showOrderForm}
          onClose={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
}
