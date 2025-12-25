'use client';

import { use } from 'react';
import Image from 'next/image';
import { products } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Package, Truck, Shield } from 'lucide-react';
import { store } from '@/lib/store';
import { useState } from 'react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    store.addToCart({ product, quantity: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              {product.featured && (
                <Badge className="absolute top-6 right-6 text-base px-4 py-2 shadow-xl" variant="default">
                  Featured
                </Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <Badge variant="destructive" className="text-xl px-6 py-3">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-wider mb-3">{product.brand}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="text-sm px-4 py-2">{product.category}</Badge>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl border-2 border-primary/20 mb-6">
                <p className="text-5xl font-bold text-primary mb-2">${product.price.toFixed(2)}</p>
                <p className="text-base font-medium">
                  {product.stock > 0 ? (
                    <span className="text-green-600 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Out of Stock
                    </span>
                  )}
                </p>
              </div>
            </div>

            <Separator className="my-8" />

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Product Description</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <Separator className="my-8" />

          {/* Add to Cart (Fixed quantity of 1) */}
          <div className="mb-8">
            <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl mb-6">
              <p className="text-sm text-blue-900 font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Note: Products are limited to one unit per cart. You can add different products.
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full text-lg py-7 shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart className="mr-2 h-6 w-6" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">Premium Quality</p>
                  <p className="text-sm text-muted-foreground">
                    Tested and certified by independent labs
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over $50 with express delivery
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">Money-Back Guarantee</p>
                  <p className="text-sm text-muted-foreground">
                    30-day hassle-free return policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

