'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-b-2">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-destructive/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                Something Went Wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-muted-foreground text-lg">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <p className="font-mono text-sm text-destructive break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

