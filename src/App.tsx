import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { SampleCartProvider } from "./contexts/SampleCartContext";
import { SampleCartDrawer } from "./components/cart/SampleCartDrawer";
import { QuoteRequestDialog } from "./components/cart/QuoteRequestDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import("./pages/CatalogPage").then(m => ({ default: m.CatalogPage })));
const ProductPage = lazy(() => import("./pages/ProductPage").then(m => ({ default: m.ProductPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const CompanyPage = lazy(() => import("./pages/CompanyPage").then(m => ({ default: m.CompanyPage })));
const TeamPage = lazy(() => import("./pages/TeamPage").then(m => ({ default: m.TeamPage })));
const NewsPage = lazy(() => import("./pages/NewsPage").then(m => ({ default: m.NewsPage })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Get current lang from URL
const getCurrentLang = (pathname: string): 'fr' | 'en' => {
  return pathname.startsWith('/en') ? 'en' : 'fr';
};

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Routes component
const AppRoutes = () => {
  const location = useLocation();
  const lang = getCurrentLang(location.pathname);

  return (
    <>
      <SampleCartDrawer lang={lang} />
      <QuoteRequestDialog lang={lang} />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SampleCartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </SampleCartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

