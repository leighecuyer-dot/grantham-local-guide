import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TownProvider } from "@/contexts/TownContext";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Business from "./pages/Business";
import AddListing from "./pages/AddListing";
import Contact from "./pages/Contact";
import About from "./pages/About";
import LocalGuides from "./pages/LocalGuides";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirect root to default town */}
        <Route path="/" element={<Navigate to="/grantham" replace />} />
        
        {/* Town-based routes */}
        <Route path="/:town/*" element={
          <TownProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/business/:slug" element={<Business />} />
              <Route path="/add-listing" element={<AddListing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/local-guides" element={<LocalGuides />} />
            </Routes>
          </TownProvider>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
