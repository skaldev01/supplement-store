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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Cart is Empty</h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Add some premium supplements to your cart to get started on your fitness journey
            </p>
            <Link href="/products">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <Card key={item.product.id} className="border-2 hover:border-primary/30 transition-all shadow-md hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-primary font-semibold mt-1">
                          {item.product.brand}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="hover:bg-destructive/10 h-10 w-10"
                      >
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Quantity Display (Fixed at 1) */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
                        <Badge variant="secondary" className="text-base px-3 py-1">1</Badge>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-2xl text-primary">
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
          <Card className="sticky top-24 border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground font-medium">Shipping</span>
                <span className="font-bold text-lg">
                  {cartTotal >= 50 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    '$5.99'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground font-medium">Tax (8%)</span>
                <span className="font-bold text-lg">
                  ${(cartTotal * 0.08).toFixed(2)}
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-xl font-bold bg-primary/10 p-4 rounded-xl">
                <span>Total</span>
                <span className="text-primary">
                  $
                  {(
                    cartTotal +
                    (cartTotal >= 50 ? 0 : 5.99) +
                    cartTotal * 0.08
                  ).toFixed(2)}
                </span>
              </div>
              {cartTotal < 50 && (
                <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
                  <p className="text-sm text-blue-900 font-semibold text-center">
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping! 🚚
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-6">
              <Link href="/checkout" className="w-full">
                <Button className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products" className="w-full">
                <Button variant="outline" className="w-full text-base py-6 border-2">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}

