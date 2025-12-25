'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { products, faqs } from '@/lib/dummy-data';
import { ArrowRight, Shield, Truck, Award } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  // Get best-selling products (highest rating * review count)
  const bestSellers = [...products]
    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 10,000+ Athletes</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              Premium Supplements for Your Fitness Goals
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover high-quality supplements to support your health and fitness journey.
              Trusted by athletes and fitness enthusiasts worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-primary/5 transition-colors group">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">Quality Guaranteed</h3>
              <p className="text-muted-foreground leading-relaxed">
                All products are tested and certified for quality and safety by independent labs
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-primary/5 transition-colors group">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Truck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">Fast Shipping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Free shipping on orders over $50 with express delivery options available
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-primary/5 transition-colors group">
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">Expert Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Professional guidance from certified nutritionists and fitness experts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Best Sellers
              </h2>
              <p className="text-lg text-muted-foreground">
                Our most popular supplements loved by thousands of customers worldwide
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-2">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {bestSellers.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2 md:-left-4 h-10 w-10 md:h-12 md:w-12" />
            <CarouselNext className="-right-2 md:-right-4 h-10 w-10 md:h-12 md:w-12" />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our products and services
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 text-lg font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.3))] -z-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Start Your Fitness Journey?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
              Join thousands of satisfied customers and achieve your fitness goals with our premium supplements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
