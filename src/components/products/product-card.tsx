'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { store } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    store.addToCart({ product, quantity: 1 });
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.featured && (
              <Badge className="absolute top-3 right-3 shadow-lg" variant="default">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-base px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          <div className="p-5 space-y-3">
            <p className="text-xs font-medium text-primary uppercase tracking-wide">{product.brand}</p>
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t bg-gradient-to-b from-transparent to-gray-50/50">
          <div>
            <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>
          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="h-11 w-11 shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

