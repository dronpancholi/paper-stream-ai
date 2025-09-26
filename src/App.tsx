import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SecurityProvider } from "@/components/Security/SecurityProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";
import MyPapersPage from "./pages/MyPapersPage";
import PaperViewerPage from "./pages/PaperViewerPage";
import Demo from "./pages/Demo";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyPages from "./pages/MyPages";
import Bookmarks from "./pages/Bookmarks";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import AuthorsPage from "./pages/AuthorsPage";
import ClustersPage from "./pages/ClustersPage";
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
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/papers" element={<MyPapersPage />} />
                <Route path="/papers/:paperId" element={<PaperViewerPage />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/history" element={<History />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/authors" element={<AuthorsPage />} />
                <Route path="/authors/:authorId" element={<div>Author Detail Route</div>} />
                <Route path="/clusters" element={<ClustersPage />} />
                <Route path="/clusters/:clusterId" element={<div>Cluster Detail Route</div>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
