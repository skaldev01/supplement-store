// Application Constants
// Centralized configuration for the application

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'SupplementStore',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description: 'Your trusted source for premium supplements and nutrition products.',
} as const;

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 50,
  standardShippingCost: 5.99,
  taxRate: 0.08, // 8%
} as const;

export const CART_CONFIG = {
  maxQuantityPerProduct: 1, // As per requirements
  persistCart: false, // In-memory only
} as const;

export const PAGINATION_CONFIG = {
  ordersPerPage: 5,
  productsPerPage: 12,
} as const;

export const PRODUCT_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'protein', label: 'Protein' },
  { value: 'vitamins', label: 'Vitamins' },
  { value: 'pre-workout', label: 'Pre-Workout' },
  { value: 'creatine', label: 'Creatine' },
  { value: 'amino-acids', label: 'Amino Acids' },
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'health', label: 'Health' },
] as const;

export const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-25', label: 'Under $25' },
  { value: '25-40', label: '$25 - $40' },
  { value: '40-50', label: '$40 - $50' },
  { value: '50+', label: '$50+' },
] as const;

export const ORDER_STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const SORT_OPTIONS = [
  { value: 'best-sellers', label: 'Best Sellers' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
] as const;

export const DATE_FILTERS = [
  { value: 'all', label: 'All Time' },
  { value: '1day', label: 'Last 24 Hours' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
] as const;

// Route paths
export const ROUTES = {
  home: '/',
  products: '/products',
  productDetail: (id: string) => `/products/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  orderConfirmation: (id: string) => `/order-confirmation/${id}`,
  admin: {
    orders: '/admin/orders',
    orderDetail: (id: string) => `/admin/orders/${id}`,
  },
} as const;

// Feature flags
export const FEATURES = {
  adminPortal: process.env.NEXT_PUBLIC_ENABLE_ADMIN_PORTAL !== 'false',
  cart: process.env.NEXT_PUBLIC_ENABLE_CART !== 'false',
} as const;

