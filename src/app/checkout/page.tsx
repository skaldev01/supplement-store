'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { store } from '@/lib/store';
import { CartItem, ShippingInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, CreditCard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateCart = () => {
      setCartItems(store.getCart());
      setCartTotal(store.getCartTotal());
      setIsLoading(false);
    };

    updateCart();
    const unsubscribe = store.subscribe(updateCart);
    return unsubscribe;
  }, []);

  // Redirect if cart is empty (only after loading)
  useEffect(() => {
    if (!isLoading && cartItems.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [cartItems, router, isSubmitting, isLoading]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingInfo.address.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingInfo.address.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.address.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Calculate order totals
    const subtotal = cartTotal;
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId: store.getCurrentUser().id,
      userName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      userEmail: shippingInfo.email,
      userPhone: shippingInfo.phone,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      shippingAddress: shippingInfo.address,
    };

    // Save order
    store.createOrder(order);

    // Clear cart
    store.clearCart();

    // Redirect to success page
    setTimeout(() => {
      router.push(`/order-confirmation/${order.id}`);
    }, 500);
  };

  const updateField = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setShippingInfo({
        ...shippingInfo,
        address: {
          ...shippingInfo.address,
          [addressField]: value,
        },
      });
    } else {
      setShippingInfo({
        ...shippingInfo,
        [field]: value,
      });
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const subtotal = cartTotal;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Show loading state while checking cart
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xl text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if cart is empty (will redirect)
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Checkout
          </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <Card className="mb-8 border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
                  <CardTitle className="text-2xl">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="street">
                      Street Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="street"
                      value={shippingInfo.address.street}
                      onChange={(e) => updateField('address.street', e.target.value)}
                      className={errors.street ? 'border-destructive' : ''}
                    />
                    {errors.street && (
                      <p className="text-sm text-destructive mt-1">{errors.street}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="street2">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="street2"
                      value={shippingInfo.address.street2 || ''}
                      onChange={(e) => updateField('address.street2', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={shippingInfo.address.city}
                        onChange={(e) => updateField('address.city', e.target.value)}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">
                        State <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="state"
                        value={shippingInfo.address.state}
                        onChange={(e) => updateField('address.state', e.target.value)}
                        placeholder="CA"
                        className={errors.state ? 'border-destructive' : ''}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">
                        ZIP Code <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.address.zipCode}
                        onChange={(e) => updateField('address.zipCode', e.target.value)}
                        placeholder="90210"
                        className={errors.zipCode ? 'border-destructive' : ''}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={shippingInfo.address.country}
                      onValueChange={(value) => updateField('address.country', value)}
                    >
                      <SelectTrigger id="country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">United States</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg py-7 shadow-lg hover:shadow-xl transition-all" 
                disabled={isSubmitting}
              >
                <CreditCard className="mr-2 h-6 w-6" />
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24 border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Products */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary">${item.product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className="font-bold text-lg">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground font-medium">Tax (8%)</span>
                    <span className="font-bold text-lg">${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-xl font-bold bg-primary/10 p-4 rounded-xl">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 50 && (
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
                    <p className="text-sm text-blue-900 font-semibold text-center">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping! 🚚
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

