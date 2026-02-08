import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CatalogPage from "./pages/CatalogPage";
import PlannerPage from "./pages/PlannerPage";
import LightCurvePage from "./pages/LightCurvePage";
import SpectroscopyPage from "./pages/SpectroscopyPage";
import TransientsPage from "./pages/TransientsPage";
import ResearchPage from "./pages/ResearchPage";
import SurveyPage from "./pages/SurveyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/lightcurve" element={<LightCurvePage />} />
          <Route path="/spectroscopy" element={<SpectroscopyPage />} />
          <Route path="/transients" element={<TransientsPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
