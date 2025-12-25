import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products } from '@/lib/dummy-data';
import { ProductCategory } from '@/types';

const categories = [
  {
    name: 'Protein',
    value: 'protein' as ProductCategory,
    description: 'Build muscle and recover faster',
    icon: '💪',
  },
  {
    name: 'Vitamins',
    value: 'vitamins' as ProductCategory,
    description: 'Essential daily nutrients',
    icon: '🌟',
  },
  {
    name: 'Pre-Workout',
    value: 'pre-workout' as ProductCategory,
    description: 'Boost energy and performance',
    icon: '⚡',
  },
  {
    name: 'Creatine',
    value: 'creatine' as ProductCategory,
    description: 'Increase strength and power',
    icon: '🔥',
  },
  {
    name: 'Amino Acids',
    value: 'amino-acids' as ProductCategory,
    description: 'Support muscle recovery',
    icon: '🧬',
  },
  {
    name: 'Weight Loss',
    value: 'weight-loss' as ProductCategory,
    description: 'Achieve your fitness goals',
    icon: '🎯',
  },
  {
    name: 'Health',
    value: 'health' as ProductCategory,
    description: 'Overall wellness support',
    icon: '❤️',
  },
];

export default function CategoriesPage() {
  const getCategoryCount = (category: ProductCategory) => {
    return products.filter((p) => p.category === category).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shop by Category</h1>
        <p className="text-muted-foreground text-lg">
          Find the perfect supplements for your fitness goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const count = getCategoryCount(category.value);
          
          return (
            <Link key={category.value} href={`/products?category=${category.value}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{category.icon}</div>
                    <Badge variant="secondary">{count} products</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

