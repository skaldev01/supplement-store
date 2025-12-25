'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { store } from '@/lib/store';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Package, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDateLong } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateOrder = () => {
      const foundOrder = store.getOrderById(id);
      setOrder(foundOrder);
      if (foundOrder) {
        setSelectedStatus(foundOrder.status);
      }
      setIsLoading(false);
    };

    updateOrder();
    const unsubscribe = store.subscribe(updateOrder);
    return unsubscribe;
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  const handleStatusChange = (newStatus: Order['status']) => {
    setSelectedStatus(newStatus);
    store.updateOrderStatus(id, newStatus);
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/admin/orders">
          <Button variant="ghost" className="mb-6 hover:bg-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Orders
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Order Details</h1>
              <p className="text-muted-foreground text-lg">Order #{order.id}</p>
            </div>
            <Badge variant={getStatusVariant(order.status)} className="text-base px-4 py-2 w-fit">
              {order.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Product ID: {item.productId}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            <span className="text-muted-foreground">Qty:</span>{' '}
                            <span className="font-medium">{item.quantity}</span>
                          </span>
                          <span className="text-sm">
                            <span className="text-muted-foreground">Price:</span>{' '}
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                      <p className="font-semibold text-lg">{order.userName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold">{order.userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-semibold">{order.userPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                      <div className="font-semibold space-y-0.5">
                        <p>{order.shippingAddress.street}</p>
                        {order.shippingAddress.street2 && (
                          <p>{order.shippingAddress.street2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status" className="mb-2 block">
                    Update Status
                  </Label>
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Pending</span>
                          <span className="text-xs text-muted-foreground">
                            Order received, awaiting processing
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="processing">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Processing</span>
                          <span className="text-xs text-muted-foreground">
                            Order is being prepared
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="shipped">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Shipped</span>
                          <span className="text-xs text-muted-foreground">
                            Order has been shipped
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="delivered">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Delivered</span>
                          <span className="text-xs text-muted-foreground">
                            Order has been delivered
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Cancelled</span>
                          <span className="text-xs text-muted-foreground">
                            Order has been cancelled
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedStatus !== order.status && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      Status updated successfully
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                    <p className="font-semibold">{formatDateLong(order.createdAt)}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-mono font-semibold">{order.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer ID</p>
                  <p className="font-mono">{order.userId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
