'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { store } from '@/lib/store';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      setCartItems(store.getCart());
      setCartTotal(store.getCartTotal());
    };

    updateCart();
    const unsubscribe = store.subscribe(updateCart);
    return unsubscribe;
  }, []);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    store.updateCartItemQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    store.removeFromCart(productId);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some products to your cart to get started
          </p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-semibold hover:text-primary">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.product.brand}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Display (Fixed at 1) */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <Badge variant="secondary">1</Badge>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {cartTotal >= 50 ? 'FREE' : '$5.99'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">
                  ${(cartTotal * 0.08).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  $
                  {(
                    cartTotal +
                    (cartTotal >= 50 ? 0 : 5.99) +
                    cartTotal * 0.08
                  ).toFixed(2)}
                </span>
              </div>
              {cartTotal < 50 && (
                <p className="text-sm text-muted-foreground">
                  Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products" className="w-full">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

