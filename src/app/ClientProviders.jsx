'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/AuthContext";
import NavigationTracker from "@/lib/NavigationTracker";
import VisualEditAgent from "@/lib/VisualEditAgent";
import { useState, Suspense } from 'react';

export default function ClientProviders({ children }) {
  // Create a client inside the component to avoid sharing state between requests
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <NavigationTracker />
        </Suspense>
        {children}
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  );
}
