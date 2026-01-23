'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { orderFormSchema, OrderFormValues } from '@/lib/validations';
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';

interface CartCheckoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CartCheckoutDialog({ open, onClose }: CartCheckoutDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      address: '',
      quantity: 1,
      notes: '',
      productId: '',
    },
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setIsSubmitting(true);
      
      console.log('Form data:', data);
      console.log('Cart items:', items);
      
      // Create orders for each item in cart
      const orderPromises = items.map(item => {
        const orderData = {
          customerName: data.customerName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          productId: item.id,
          quantity: item.quantity,
          notes: data.notes || '',
        };
        
        console.log('Sending order:', orderData);
        
        return fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
      });

      const responses = await Promise.all(orderPromises);
      
      console.log('Responses:', responses);
      
      // Check if all orders succeeded
      const allSuccessful = responses.every(res => res.ok);
      
      if (allSuccessful) {
        toast({
          title: 'Orders placed successfully!',
          description: `${items.length} order(s) have been placed. We will contact you shortly.`,
        });

        clearCart();
        form.reset();
        onClose();
        router.push('/order-success');
      } else {
        // Get error details from failed responses
        const failedResponses = await Promise.all(
          responses.map(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              return errorData;
            }
            return null;
          })
        );
        
        console.error('Failed responses:', failedResponses.filter(Boolean));
        throw new Error('Some orders failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to place orders. Please try again.',
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <DialogTitle>Complete Your Order</DialogTitle>
          </div>
          <DialogDescription>
            Enter your details once for all {items.length} product(s) in your cart
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600">{item.potency} • {item.form}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">× {item.quantity}</p>
                        <p className="text-gray-600">{formatCurrency(item.sellingPrice * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Delivery Information</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+92 300 1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complete Delivery Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your complete address including street, area, city, province, and any landmarks"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Full address with city, area, street, house number, and landmarks
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
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special instructions or notes for all orders"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="gap-2"
                asChild
              >
                <Link href="/cart">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cart
                </Link>
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Place Order{items.length > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
