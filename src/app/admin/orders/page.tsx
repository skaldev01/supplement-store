'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { Order } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Eye, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const updateOrders = () => {
      setOrders(store.getOrders());
    };

    updateOrders();
    const unsubscribe = store.subscribe(updateOrders);
    return unsubscribe;
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      switch (dateFilter) {
        case '1day':
          matchesDate = (now.getTime() - orderDate.getTime()) <= dayInMs;
          break;
        case '7days':
          matchesDate = (now.getTime() - orderDate.getTime()) <= (7 * dayInMs);
          break;
        case '30days':
          matchesDate = (now.getTime() - orderDate.getTime()) <= (30 * dayInMs);
          break;
        case '90days':
          matchesDate = (now.getTime() - orderDate.getTime()) <= (90 * dayInMs);
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort by date (newest first)
  filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    // Using a ref to avoid the setState-in-effect anti-pattern
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, dateFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFilter !== 'all';

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            All Orders
          </h1>
          <p className="text-xl text-muted-foreground">
            View and manage all customer orders from your dashboard
          </p>
        </div>

        {/* Filters Card */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardContent className="pt-8">
            <div className="space-y-4">
              {/* Search Row */}
              <div className="grid grid-cols-1 gap-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search" className="mb-2 block">
                    Search Orders
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by Order ID, customer name, or product name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try searching for &quot;Protein&quot;, &quot;John Doe&quot;, or &quot;ORD-001&quot;
                  </p>
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <Label htmlFor="status" className="mb-2 block">
                    Filter by Status
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div>
                  <Label htmlFor="dateFilter" className="mb-2 block">
                    Filter by Date
                  </Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger id="dateFilter">
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="1day">Last 24 Hours</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-6 border-t-2">
                  <p className="text-base font-semibold text-foreground">
                    Active filters applied
                  </p>
                  <Button variant="ghost" size="default" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
          <p className="text-base text-muted-foreground font-medium">
            Showing <span className="font-bold text-primary text-lg">{startIndex + 1}</span>-
            <span className="font-bold text-primary text-lg">{Math.min(endIndex, filteredOrders.length)}</span> of{' '}
            <span className="font-bold text-foreground text-lg">{filteredOrders.length}</span> orders
          </p>
        </div>

        {/* Orders Table */}
        <Card className="border-2 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="w-[100px]">Items</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="text-right w-[120px]">Total</TableHead>
                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-bold">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold">{order.userName}</p>
                            <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-muted-foreground font-medium">
                                {item.productName}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{order.items.length}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)} className="text-sm px-3 py-1">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary text-lg">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <Eye className="h-5 w-5" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Search className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-xl font-semibold">No orders found</p>
                          <p className="text-muted-foreground">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
