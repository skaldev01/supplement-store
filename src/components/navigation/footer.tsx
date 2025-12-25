'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="border-t-2 bg-gradient-to-b from-white to-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-16">
        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-foreground text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              SupplementStore
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Your trusted source for premium supplements and nutrition products designed for peak performance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3 text-base">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-foreground font-bold text-lg mb-5">Customer Service</h4>
            <ul className="space-y-3 text-base">
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-foreground font-bold text-lg mb-5">Follow Us</h4>
            <p className="text-muted-foreground mb-4 text-base">Stay connected for updates and offers</p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile View - Collapsible */}
        <div className="md:hidden space-y-4 mb-12">
          {/* Company Info - Always Visible */}
          <div className="mb-8">
            <h3 className="text-foreground text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              SupplementStore
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Your trusted source for premium supplements and nutrition products designed for peak performance.
            </p>
          </div>

          {/* Quick Links - Collapsible */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('quick-links')}
              className="w-full flex items-center justify-between py-4 text-foreground font-bold text-lg"
            >
              Quick Links
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'quick-links' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'quick-links' && (
              <ul className="space-y-3 text-base pb-4 animate-in slide-in-from-top">
                <li>
                  <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span> Products
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span> About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span> Contact
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Customer Service - Collapsible */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('customer-service')}
              className="w-full flex items-center justify-between py-4 text-foreground font-bold text-lg"
            >
              Customer Service
              <ChevronDown className={`h-5 w-5 transition-transform ${openSection === 'customer-service' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'customer-service' && (
              <ul className="space-y-3 text-base pb-4 animate-in slide-in-from-top">
                <li>
                  <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span> Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span> Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span> FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="group-hover:translate-x-1 transition-transform">→</span> Support
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Social Media - Always Visible */}
          <div className="pt-4">
            <h4 className="text-foreground font-bold text-lg mb-4">Follow Us</h4>
            <p className="text-muted-foreground mb-4 text-base">Stay connected for updates and offers</p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shadow-sm hover:shadow-md"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 pt-8 text-center">
          <p className="text-muted-foreground font-medium">&copy; 2024 SupplementStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

