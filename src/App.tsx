import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SecurityProvider } from "@/components/Security/SecurityProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageTransition } from "@/components/Layout/PageTransition";
import { RouteGuard } from "@/components/Layout/RouteGuard";
import { NavigationWrapper } from "@/components/Layout/NavigationWrapper";
import { Loader2 } from "lucide-react";

// Eager load critical pages
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy load secondary pages for better performance
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MyPapersPage = lazy(() => import("./pages/MyPapersPage"));
const PaperViewerPage = lazy(() => import("./pages/PaperViewerPage"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const AuthorsPage = lazy(() => import("./pages/AuthorsPage"));
const AuthorDetailPage = lazy(() => import("./pages/AuthorDetailPage"));
const ClustersPage = lazy(() => import("./pages/ClustersPage"));
const ClusterDetailPage = lazy(() => import("./pages/ClusterDetailPage"));
const Settings = lazy(() => import("./pages/Settings"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <NavigationWrapper />
              <PageTransition>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/signup" element={<Navigate to="/auth" replace />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/search" element={<RouteGuard><SearchPage /></RouteGuard>} />
                    <Route path="/papers" element={<RouteGuard><MyPapersPage /></RouteGuard>} />
                    <Route path="/papers/:paperId" element={<RouteGuard><PaperViewerPage /></RouteGuard>} />
                    <Route path="/bookmarks" element={<RouteGuard><Bookmarks /></RouteGuard>} />
                    <Route path="/history" element={<RouteGuard><HistoryPage /></RouteGuard>} />
                    <Route path="/analysis" element={<RouteGuard><AnalyticsPage /></RouteGuard>} />
                    <Route path="/authors" element={<RouteGuard><AuthorsPage /></RouteGuard>} />
                    <Route path="/authors/:authorId" element={<RouteGuard><AuthorDetailPage /></RouteGuard>} />
                    <Route path="/clusters" element={<RouteGuard><ClustersPage /></RouteGuard>} />
                    <Route path="/clusters/:clusterId" element={<RouteGuard><ClusterDetailPage /></RouteGuard>} />
                    <Route path="/profile" element={<RouteGuard><Profile /></RouteGuard>} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/settings" element={<RouteGuard><Settings /></RouteGuard>} />
                    
                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </PageTransition>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
