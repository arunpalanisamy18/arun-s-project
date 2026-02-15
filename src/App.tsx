import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import PlannerPage from "./pages/PlannerPage";
import LightCurvePage from "./pages/LightCurvePage";
import SpectroscopyPage from "./pages/SpectroscopyPage";
import TransientsPage from "./pages/TransientsPage";
import ResearchPage from "./pages/ResearchPage";
import SurveyPage from "./pages/SurveyPage";
import DiscoveryPage from "./pages/DiscoveryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LoginGuard() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginGuard />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><PlannerPage /></ProtectedRoute>} />
            <Route path="/lightcurve" element={<ProtectedRoute><LightCurvePage /></ProtectedRoute>} />
            <Route path="/spectroscopy" element={<ProtectedRoute><SpectroscopyPage /></ProtectedRoute>} />
            <Route path="/transients" element={<ProtectedRoute><TransientsPage /></ProtectedRoute>} />
            <Route path="/research" element={<ProtectedRoute><ResearchPage /></ProtectedRoute>} />
            <Route path="/survey" element={<ProtectedRoute><SurveyPage /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><DiscoveryPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
