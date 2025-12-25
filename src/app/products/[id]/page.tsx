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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.featured && (
              <Badge className="absolute top-4 right-4" variant="default">
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <p className="text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-2 font-semibold">{product.rating}</span>
                <span className="ml-1 text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Add to Cart (Fixed quantity of 1) */}
          <div className="mb-6">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground">
                Note: Products are limited to one unit per cart. You can add different products.
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Premium Quality</p>
                  <p className="text-sm text-muted-foreground">
                    Tested and certified products
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over $50
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Money-Back Guarantee</p>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

