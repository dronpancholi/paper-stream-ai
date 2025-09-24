import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SecurityProvider } from "@/components/Security/SecurityProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SwipePreventWrapper } from "@/components/Layout/SwipePreventWrapper";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Auth from "./pages/Auth";
import MyPages from "./pages/MyPages";
import Bookmarks from "./pages/Bookmarks";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import Authors from "./pages/Authors";
import Clusters from "./pages/Clusters";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
            <SwipePreventWrapper>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/my-pages" element={<MyPages />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/authors" element={<Authors />} />
                  <Route path="/clusters" element={<Clusters />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SwipePreventWrapper>
          </TooltipProvider>
        </SecurityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
