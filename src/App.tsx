import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { SampleCartProvider } from "./contexts/SampleCartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SampleCartDrawer } from "./components/cart/SampleCartDrawer";
import { QuoteRequestDialog } from "./components/cart/QuoteRequestDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import("./pages/CatalogPage").then(m => ({ default: m.CatalogPage })));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const CompanyPage = lazy(() => import("./pages/CompanyPage").then(m => ({ default: m.CompanyPage })));
const TeamPage = lazy(() => import("./pages/TeamPage").then(m => ({ default: m.TeamPage })));
const NewsPage = lazy(() => import("./pages/NewsPage").then(m => ({ default: m.NewsPage })));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const AccountPage = lazy(() => import("./pages/AccountPage").then(m => ({ default: m.AccountPage })));

// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CosmetiqueListPage = lazy(() => import("./pages/admin/cosmetiques/CosmetiqueListPage"));
const CosmetiqueEditPage = lazy(() => import("./pages/admin/cosmetiques/CosmetiqueEditPage"));
const ParfumListPage = lazy(() => import("./pages/admin/parfums/ParfumListPage"));
const ParfumEditPage = lazy(() => import("./pages/admin/parfums/ParfumEditPage"));
const ParfumPerformancePage = lazy(() => import("./pages/admin/parfums/ParfumPerformancePage"));
const AromeListPage = lazy(() => import("./pages/admin/aromes/AromeListPage"));
const AromeEditPage = lazy(() => import("./pages/admin/aromes/AromeEditPage"));
const DemandesListPage = lazy(() => import("./pages/admin/demandes/DemandesListPage"));
const DemandeDetailPage = lazy(() => import("./pages/admin/demandes/DemandeDetailPage"));

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
  <div className="min-h-screen flex items-center justify-center bg-forest-950">
    <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
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
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Redirect root to French */}
            <Route path="/" element={<Navigate to="/fr" replace />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* French Routes */}
            <Route path="/fr" element={<HomePage lang="fr" />} />
            <Route path="/fr/catalogue" element={<CatalogPage lang="fr" />} />
            <Route path="/fr/produit/:code" element={<ProductPage />} />
            <Route path="/fr/entreprise" element={<CompanyPage lang="fr" />} />
            <Route path="/fr/equipe" element={<TeamPage lang="fr" />} />
            <Route path="/fr/actualites" element={<NewsPage lang="fr" />} />
            <Route path="/fr/contact" element={<ContactPage lang="fr" />} />
            <Route path="/fr/mon-compte" element={<ProtectedRoute><AccountPage lang="fr" /></ProtectedRoute>} />

            {/* English Routes */}
            <Route path="/en" element={<HomePage lang="en" />} />
            <Route path="/en/catalogue" element={<CatalogPage lang="en" />} />
            <Route path="/en/produit/:code" element={<ProductPage />} />
            <Route path="/en/entreprise" element={<CompanyPage lang="en" />} />
            <Route path="/en/equipe" element={<TeamPage lang="en" />} />
            <Route path="/en/actualites" element={<NewsPage lang="en" />} />
            <Route path="/en/contact" element={<ContactPage lang="en" />} />
            <Route path="/en/my-account" element={<ProtectedRoute><AccountPage lang="en" /></ProtectedRoute>} />

            {/* Admin Routes - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="demandes" element={<DemandesListPage />} />
              <Route path="demandes/:id" element={<DemandeDetailPage />} />
              <Route path="cosmetiques" element={<CosmetiqueListPage />} />
              <Route path="cosmetiques/new" element={<CosmetiqueEditPage />} />
              <Route path="cosmetiques/:code" element={<CosmetiqueEditPage />} />
              <Route path="parfums" element={<ParfumListPage />} />
              <Route path="parfums/new" element={<ParfumEditPage />} />
              <Route path="parfums/:code" element={<ParfumEditPage />} />
              <Route path="parfums/:code/performance" element={<ParfumPerformancePage />} />
              <Route path="aromes" element={<AromeListPage />} />
              <Route path="aromes/new" element={<AromeEditPage />} />
              <Route path="aromes/:code" element={<AromeEditPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SampleCartProvider>
              <Toaster />
              <Sonner />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </SampleCartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;