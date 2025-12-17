import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { ContactPage } from "./pages/ContactPage";
import { CompanyPage } from "./pages/CompanyPage";
import { TeamPage } from "./pages/TeamPage";
import { NewsPage } from "./pages/NewsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to French */}
            <Route path="/" element={<Navigate to="/fr" replace />} />
            
            {/* French Routes */}
            <Route path="/fr" element={<HomePage lang="fr" />} />
            <Route path="/fr/catalogue" element={<CatalogPage lang="fr" />} />
            <Route path="/fr/produit/:id" element={<ProductPage lang="fr" />} />
            <Route path="/fr/entreprise" element={<CompanyPage lang="fr" />} />
            <Route path="/fr/equipe" element={<TeamPage lang="fr" />} />
            <Route path="/fr/actualites" element={<NewsPage lang="fr" />} />
            <Route path="/fr/contact" element={<ContactPage lang="fr" />} />
            
            {/* English Routes */}
            <Route path="/en" element={<HomePage lang="en" />} />
            <Route path="/en/catalogue" element={<CatalogPage lang="en" />} />
            <Route path="/en/produit/:id" element={<ProductPage lang="en" />} />
            <Route path="/en/entreprise" element={<CompanyPage lang="en" />} />
            <Route path="/en/equipe" element={<TeamPage lang="en" />} />
            <Route path="/en/actualites" element={<NewsPage lang="en" />} />
            <Route path="/en/contact" element={<ContactPage lang="en" />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
