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
import ResetPassword from "./pages/ResetPassword";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();
  const paddingClass = state === "collapsed" ? "pl-12" : "pl-64"; // 12 for collapsed, 64 (16rem) for expanded

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className={`flex-1 transition-[padding] duration-200 ${paddingClass}`}>
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <SidebarProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </SidebarProvider>
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
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/tasks/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;