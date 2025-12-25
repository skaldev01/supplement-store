'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, ClipboardList, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setCartCount(store.getCartItemCount());
    };

    updateState();
    const unsubscribe = store.subscribe(updateState);
    return unsubscribe;
  }, []);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="border-b-2 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              SupplementStore
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-base font-semibold hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-base font-semibold hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all"
            >
              Products
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 h-12 w-12">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold shadow-lg"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Provider Portal Button */}
            <Link href="/admin/orders">
              <Button variant="default" size="default" className="hidden md:flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                <ClipboardList className="h-4 w-4" />
                Provider Portal
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 mt-5 pt-4 pb-4 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-lg font-semibold hover:text-primary transition-colors px-2 py-2 hover:bg-primary/5 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-lg font-semibold hover:text-primary transition-colors px-2 py-2 hover:bg-primary/5 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="text-lg font-semibold hover:text-primary transition-colors px-2 py-2 hover:bg-primary/5 rounded-lg flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClipboardList className="h-5 w-5" />
                Provider Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

