import React, { Suspense } from "react";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProgressiveWalletProvider } from "@/components/ProgressiveWalletProvider";
import { PageLoadingFallback, ComponentLoadingFallback } from "@/components/LoadingFallback";

// Lazy load components for code splitting with error handling
const Index = React.lazy(() => 
  import("./pages/Index").catch(error => {
    console.error('Failed to load Index page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load home page</div> };
  })
);

const About = React.lazy(() => 
  import("./pages/About").catch(error => {
    console.error('Failed to load About page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load about page</div> };
  })
);

const NotFound = React.lazy(() => 
  import("./pages/NotFound").catch(error => {
    console.error('Failed to load NotFound page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Page not found</div> };
  })
);

const CreateEvent = React.lazy(() => 
  import("./pages/CreateEvent").catch(error => {
    console.error('Failed to load CreateEvent page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load create event page</div> };
  })
);

const ExploreEvents = React.lazy(() => 
  import("./pages/ExploreEvents").catch(error => {
    console.error('Failed to load ExploreEvents page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load explore events page</div> };
  })
);

const EventDetailsPage = React.lazy(() => 
  import("./pages/EventDetailsPage").catch(error => {
    console.error('Failed to load EventDetailsPage:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load event details page</div> };
  })
);

const OrganizationDashboard = React.lazy(() => 
  import("./pages/dashboard/OrganizationDashboard").catch(error => {
    console.error('Failed to load OrganizationDashboard page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load dashboard</div> };
  })
);

const TemplateBuilder = React.lazy(() => 
  import("./pages/certification/TemplateBuilder").catch(error => {
    console.error('Failed to load TemplateBuilder page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load template builder</div> };
  })
);

const RecipientManagement = React.lazy(() => 
  import("./pages/certification/RecipientManagement").catch(error => {
    console.error('Failed to load RecipientManagement page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load recipient management</div> };
  })
);

const Analytics = React.lazy(() => 
  import("./pages/dashboard/Analytics").catch(error => {
    console.error('Failed to load Analytics page:', error);
    return { default: () => <div className="p-8 text-center text-red-500">Failed to load analytics</div> };
  })
);

// Enhanced QueryClient with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ProgressiveWalletProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <ErrorBoundary>
                <Suspense fallback={<PageLoadingFallback message="Loading application..." />}>
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <ErrorBoundary>
                          <Index />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/about" 
                      element={
                        <ErrorBoundary>
                          <About />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/create-event" 
                      element={
                        <ErrorBoundary>
                          <CreateEvent />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/explore-events" 
                      element={
                        <ErrorBoundary>
                          <ExploreEvents />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/event/:id" 
                      element={
                        <ErrorBoundary>
                          <EventDetailsPage />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ErrorBoundary>
                          <OrganizationDashboard />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/template-builder" 
                      element={
                        <ErrorBoundary>
                          <TemplateBuilder />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/recipient-management" 
                      element={
                        <ErrorBoundary>
                          <RecipientManagement />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <ErrorBoundary>
                          <Analytics />
                        </ErrorBoundary>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </ProgressiveWalletProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
