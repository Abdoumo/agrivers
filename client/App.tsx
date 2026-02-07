import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import TraderDashboard from "./pages/TraderDashboard";
import MarketAnalysis from "./pages/MarketAnalysis";
import PrePlantingMatch from "./pages/PrePlantingMatch";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { LanguageProvider } from "./components/LanguageProvider";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Initialize demo data on first load
const initializeDemoData = () => {
  const users = localStorage.getItem("users");
  if (!users) {
    const demoUsers = [
      {
        id: "1",
        name: "Ahmed Al-Mansouri",
        email: "farmer@demo.com",
        password: "password",
        phone: "+966 50 1234 5678",
        region: "الرياض",
        role: "farmer",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Fatima Al-Khalifa",
        email: "trader@demo.com",
        password: "password",
        phone: "+966 55 8765 4321",
        region: "الدمام",
        role: "trader",
        createdAt: new Date().toISOString(),
      },
      {
        id: "admin",
        name: "Admin User",
        email: "admin@demo.com",
        password: "password",
        phone: "+966 50 0000 0000",
        region: "الرياض",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("users", JSON.stringify(demoUsers));
  }
};

const App = () => {
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/trader-dashboard" element={<TraderDashboard />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
              <Route path="/pre-planting-match" element={<PrePlantingMatch />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
