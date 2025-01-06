import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Inbox from "./pages/Inbox";
import Leads from "./pages/Leads";
import Lead from "./pages/Lead";
import ResetPassword from "./pages/ResetPassword";
import { AppSidebar } from "./components/AppSidebar";
import { AppHeader } from "./components/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminProvider } from "./contexts/AdminContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? (
    <AdminProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminProvider>
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <Admin />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks/inbox" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <Inbox />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leads" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <Leads />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lead/:id" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <Lead />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <Index />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;