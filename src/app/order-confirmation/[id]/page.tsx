'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmationPage({ params }: PageProps) {
  const { id } = use(params);
  const order = store.getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full mb-6 shadow-lg animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Order Confirmed!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Thank you for your purchase. Your order has been received and is being processed with care.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8 border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <CardTitle className="text-2xl">Order Details</CardTitle>
                  <p className="text-base text-muted-foreground mt-2 font-semibold">
                    Order #{order.id}
                  </p>
                </div>
                <Badge variant="outline" className="text-base px-4 py-2 w-fit">{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
            {/* Order Items */}
            <div>
              <h3 className="font-bold text-xl mb-5">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{item.productName}</p>
                      <p className="text-sm text-muted-foreground font-medium">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-primary text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div>
              <h3 className="font-bold text-xl mb-5">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="font-bold text-lg">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground font-medium">Shipping</span>
                  <span className="font-bold text-lg">
                    {order.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${order.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground font-medium">Tax (8%)</span>
                  <span className="font-bold text-lg">${order.tax.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-xl bg-primary/10 p-4 rounded-xl">
                  <span>Total</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Shipping Address */}
            <div>
              <h3 className="font-bold text-xl mb-5">Shipping Address</h3>
              <div className="bg-gray-50 p-5 rounded-xl text-base">
                <p className="font-bold text-lg mb-1">{order.userName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                {order.shippingAddress.street2 && (
                  <p className="text-muted-foreground">{order.shippingAddress.street2}</p>
                )}
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Contact Information */}
            <div>
              <h3 className="font-bold text-xl mb-5">Contact Information</h3>
              <div className="bg-gray-50 p-5 rounded-xl text-base space-y-2">
                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> {order.userEmail}</p>
                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Phone:</span> {order.userPhone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              What&apos;s Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                1
              </div>
              <div>
                <p className="font-bold text-lg">Order Confirmation</p>
                <p className="text-base text-muted-foreground">
                  You&apos;ll receive an email confirmation shortly with all the details
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                2
              </div>
              <div>
                <p className="font-bold text-lg">Processing</p>
                <p className="text-base text-muted-foreground">
                  We&apos;ll carefully prepare your order for shipment
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                3
              </div>
              <div>
                <p className="font-bold text-lg">Shipping</p>
                <p className="text-base text-muted-foreground">
                  Track your order status and delivery progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/orders" className="flex-1">
            <Button variant="outline" className="w-full text-lg py-6 border-2">
              View All Orders
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all">
              Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

