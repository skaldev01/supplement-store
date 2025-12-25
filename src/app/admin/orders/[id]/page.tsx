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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Loading order details...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/admin/orders">
          <Button variant="ghost" className="mb-8 hover:bg-white text-base" size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to All Orders
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Order Details
              </h1>
              <p className="text-xl text-muted-foreground font-semibold">Order #{order.id}</p>
            </div>
            <Badge variant={getStatusVariant(order.status)} className="text-lg px-6 py-3 w-fit shadow-md">
              {order.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex gap-5 p-5 border-2 rounded-xl hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                      <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl mb-2">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-3">
                          Product ID: {item.productId}
                        </p>
                        <div className="flex items-center gap-6">
                          <span className="text-base">
                            <span className="text-muted-foreground font-medium">Qty:</span>{' '}
                            <span className="font-bold">{item.quantity}</span>
                          </span>
                          <span className="text-base">
                            <span className="text-muted-foreground font-medium">Price:</span>{' '}
                            <span className="font-bold">${item.price.toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-8" />

                {/* Totals */}
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-bold text-xl">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className="font-bold text-xl">
                      {order.shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${order.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground font-medium">Tax (8%)</span>
                    <span className="font-bold text-xl">${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-2xl font-bold bg-primary/10 p-5 rounded-xl">
                    <span>Total</span>
                    <span className="text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Customer Name</p>
                      <p className="font-bold text-xl">{order.userName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Email</p>
                      <p className="font-bold text-lg break-all">{order.userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Phone</p>
                      <p className="font-bold text-lg">{order.userPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl md:col-span-2">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Shipping Address</p>
                      <div className="font-bold text-base space-y-1">
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
          <div className="space-y-8">
            {/* Order Status */}
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
                <CardTitle className="text-2xl">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
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
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-base text-green-900 font-semibold text-center">
                      ✓ Status updated successfully
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
                <CardTitle className="text-2xl">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 font-medium">Order Date</p>
                    <p className="font-bold text-lg">{formatDateLong(order.createdAt)}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Order ID</p>
                  <p className="font-mono font-bold text-lg">{order.id}</p>
                </div>
                <Separator className="my-4" />
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Customer ID</p>
                  <p className="font-mono font-bold text-lg">{order.userId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
