// Simple in-memory store for cart and user state
// In a real app, this would use Context API, Zustand, or Redux

import { CartItem, User, Order } from '@/types';
import { users, orders } from './dummy-data';

class Store {
  private cart: CartItem[] = [];
  private currentUser: User = users[1]; // Default to regular user
  private listeners: Set<() => void> = new Set();

  // Cart methods
  getCart(): CartItem[] {
    return [...this.cart];
  }

  addToCart(item: CartItem): void {
    const existingItem = this.cart.find(
      (cartItem) => cartItem.product.id === item.product.id
    );

    if (existingItem) {
      // Limit to single quantity per product as per requirements
      existingItem.quantity = 1;
    } else {
      // Ensure quantity is always 1
      this.cart.push({ ...item, quantity: 1 });
    }

    this.notifyListeners();
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter((item) => item.product.id !== productId);
    this.notifyListeners();
  }

  updateCartItemQuantity(productId: string, quantity: number): void {
    // Since we limit to single quantity, this will just remove if quantity is 0
    if (quantity <= 0) {
      this.removeFromCart(productId);
    }
    // Otherwise, quantity stays at 1
    this.notifyListeners();
  }

  clearCart(): void {
    this.cart = [];
    this.notifyListeners();
  }

  getCartTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  getCartItemCount(): number {
    // Since each product is limited to quantity 1, count is just the number of items
    return this.cart.length;
  }

  // User methods
  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    this.notifyListeners();
  }

  isAdmin(): boolean {
    return this.currentUser.role === 'admin';
  }

  // Order methods
  createOrder(order: Order): void {
    orders.push(order);
    this.notifyListeners();
  }

  getOrders(): Order[] {
    return [...orders];
  }

  getOrderById(id: string): Order | undefined {
    return orders.find((order) => order.id === id);
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      this.notifyListeners();
    }
  }

  // Listener methods for reactive updates
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const store = new Store();

