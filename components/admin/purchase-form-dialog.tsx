'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { adminPurchaseApi, adminProductApi, CreatePurchaseInput } from '@/lib/api';
import { Loader2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Purchase form validation schema
const purchaseFormSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().int().positive('Quantity must be a positive number'),
  purchasePrice: z.number().positive('Purchase price must be greater than 0'),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  purchaseDate: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

interface PurchaseFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultProductId?: string;
}

export function PurchaseFormDialog({
  open,
  onClose,
  onSuccess,
  defaultProductId,
}: PurchaseFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      productId: defaultProductId || '',
      quantity: 1,
      purchasePrice: 0,
      supplier: '',
      notes: '',
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  // Load products when dialog opens
  useEffect(() => {
    if (open) {
      loadProducts();
      if (defaultProductId) {
        form.setValue('productId', defaultProductId);
      }
    }
  }, [open, defaultProductId]);

  // Load selected product details when productId changes
  useEffect(() => {
    const productId = form.watch('productId');
    if (productId) {
      const product = products.find((p) => p.id === productId);
      setSelectedProduct(product || null);
      
      // Pre-fill purchase price with product's purchase price if available
      if (product && (product as any).purchasePrice) {
        form.setValue('purchasePrice', (product as any).purchasePrice);
      }
    }
  }, [form.watch('productId'), products]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      // Fetch all active products (we'll need a large limit or implement search)
      const response = await adminProductApi.getProducts(1, 100);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const onSubmit = async (data: PurchaseFormValues) => {
    try {
      setIsSubmitting(true);

      const purchaseData: CreatePurchaseInput = {
        productId: data.productId,
        quantity: data.quantity,
        purchasePrice: data.purchasePrice,
        supplier: data.supplier || undefined,
        notes: data.notes || undefined,
        purchaseDate: data.purchaseDate 
          ? new Date(data.purchaseDate).toISOString()
          : undefined,
      };

      await adminPurchaseApi.createPurchase(purchaseData);

      toast({
        title: 'Purchase recorded',
        description: `Successfully recorded purchase of ${data.quantity} unit(s). Stock has been updated.`,
      });

      form.reset({
        productId: defaultProductId || '',
        quantity: 1,
        purchasePrice: 0,
        supplier: '',
        notes: '',
        purchaseDate: new Date().toISOString().split('T')[0],
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record purchase. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Record Purchase
          </DialogTitle>
          <DialogDescription>
            Record a new purchase to increase inventory stock. This will automatically update the product's available stock.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingProducts}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product">
                          {selectedProduct ? selectedProduct.name : 'Select a product'}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.sellingPrice)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the product you're purchasing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of units purchased
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price (per unit) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Cost per unit (not shown to customers)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter supplier name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Name of the supplier or vendor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Date of purchase (defaults to today)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this purchase"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProduct && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">
                  Purchase Summary
                </div>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{form.watch('quantity') || 0} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span className="font-medium">{formatCurrency(form.watch('purchasePrice') || 0)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-300">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="font-bold text-blue-900">
                      {formatCurrency((form.watch('quantity') || 0) * (form.watch('purchasePrice') || 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || loadingProducts}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Purchase
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
