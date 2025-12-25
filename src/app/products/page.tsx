'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { products } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [sortBy, setSortBy] = useState<string>('best-sellers');

  const categories: { value: string; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'protein', label: 'Protein' },
    { value: 'vitamins', label: 'Vitamins' },
    { value: 'pre-workout', label: 'Pre-Workout' },
    { value: 'creatine', label: 'Creatine' },
    { value: 'amino-acids', label: 'Amino Acids' },
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'health', label: 'Health' },
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-40', label: '$25 - $40' },
    { value: '40-50', label: '$40 - $50' },
    { value: '50+', label: '$50+' },
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Search filter (by name and description)
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    // Price range filter
    let matchesPriceRange = true;
    if (priceRange !== 'all') {
      if (priceRange === '0-25') {
        matchesPriceRange = product.price < 25;
      } else if (priceRange === '25-40') {
        matchesPriceRange = product.price >= 25 && product.price < 40;
      } else if (priceRange === '40-50') {
        matchesPriceRange = product.price >= 40 && product.price < 50;
      } else if (priceRange === '50+') {
        matchesPriceRange = product.price >= 50;
      }
    }

    // Best sellers filter
    const isBestSeller = product.rating >= 4.7 && product.reviewCount >= 200;
    const matchesBestSellers = !showBestSellers || isBestSeller;

    return matchesSearch && matchesCategory && matchesPriceRange && matchesBestSellers;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name-desc') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'best-sellers') {
    filteredProducts.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
  }

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setShowBestSellers(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || priceRange !== 'all' || showBestSellers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            All Products
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of premium supplements designed for your fitness goals
          </p>
        </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-bold text-xl">Filters & Search</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Label htmlFor="search" className="text-sm mb-2 block">
              Search Products
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Label htmlFor="category" className="text-sm mb-2 block">
              Category
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div>
            <Label htmlFor="price" className="text-sm mb-2 block">
              Price Range
            </Label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger id="price">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Sellers Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={showBestSellers ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowBestSellers(!showBestSellers)}
            >
              {showBestSellers ? '✓ ' : ''}Best Sellers Only
            </Button>
          </div>

          {/* Sort */}
          <div>
            <Label htmlFor="sort" className="text-sm mb-2 block">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best-sellers">Best Sellers</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t-2">
            <span className="text-sm font-semibold text-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1" onClick={() => setSearchQuery('')}>
                Search: &quot;{searchQuery}&quot; ×
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1" onClick={() => setSelectedCategory('all')}>
                {categories.find((c) => c.value === selectedCategory)?.label} ×
              </Badge>
            )}
            {priceRange !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1" onClick={() => setPriceRange('all')}>
                {priceRanges.find((r) => r.value === priceRange)?.label} ×
              </Badge>
            )}
            {showBestSellers && (
              <Badge variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors px-3 py-1" onClick={() => setShowBestSellers(false)}>
                Best Sellers ×
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-xl border-2 border-gray-100">
        <p className="text-muted-foreground font-medium">
          Showing <span className="font-bold text-primary text-lg">{filteredProducts.length}</span> of{' '}
          <span className="font-bold text-foreground text-lg">{products.length}</span> products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mb-3">No products found</p>
            <p className="text-muted-foreground mb-8 text-lg">
              Try adjusting your filters or search terms to find what you&apos;re looking for
            </p>
            <Button onClick={clearFilters} size="lg" className="px-8">
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

