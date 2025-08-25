import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CRMLayout from "./components/CRMLayout";
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Courses from "./pages/admin/Courses";
import Attendance from "./pages/admin/Attendance";
import Certificates from "./pages/admin/Certificates";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<CRMLayout><Dashboard /></CRMLayout>} />
          <Route path="/admin/students" element={<CRMLayout><Students /></CRMLayout>} />
          <Route path="/admin/courses" element={<CRMLayout><Courses /></CRMLayout>} />
          <Route path="/admin/attendance" element={<CRMLayout><Attendance /></CRMLayout>} />
          <Route path="/admin/certificates" element={<CRMLayout><Certificates /></CRMLayout>} />
          <Route path="/admin/analytics" element={<CRMLayout><Analytics /></CRMLayout>} />
          <Route path="/admin/settings" element={<CRMLayout><Settings /></CRMLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
