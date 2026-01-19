import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { SampleCartProvider } from "./contexts/SampleCartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationPreferencesProvider } from "./contexts/NotificationPreferencesContext";
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
const BlogArticlePage = lazy(() => import("./pages/BlogArticlePage").then(m => ({ default: m.BlogArticlePage })));
const PodcastPage = lazy(() => import("./pages/PodcastPage").then(m => ({ default: m.PodcastPage })));
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
const BlogListPage = lazy(() => import("./pages/admin/blog/BlogListPage").then(m => ({ default: m.BlogListPage })));
const BlogEditPage = lazy(() => import("./pages/admin/blog/BlogEditPage").then(m => ({ default: m.BlogEditPage })));
const ContactsListPage = lazy(() => import("./pages/admin/contacts/ContactsListPage").then(m => ({ default: m.ContactsListPage })));
const TeamListPage = lazy(() => import("./pages/admin/team/TeamListPage").then(m => ({ default: m.TeamListPage })));
const TeamEditPage = lazy(() => import("./pages/admin/team/TeamEditPage").then(m => ({ default: m.TeamEditPage })));
const UsersListPage = lazy(() => import("./pages/admin/users/UsersListPage"));
const SettingsPage = lazy(() => import("./pages/admin/settings/SettingsPage"));

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

// Root layout wrapper for context providers
const RootLayout = () => {
  const location = useLocation();
  const lang = getCurrentLang(location.pathname);

  return (
    <>
      <SampleCartDrawer lang={lang} />
      <QuoteRequestDialog lang={lang} />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </Suspense>
    </>
  );
};

// Admin layout wrapper
const AdminWrapper = () => (
  <ProtectedRoute requireAdmin>
    <AdminLayout />
  </ProtectedRoute>
);

// Create the router with future flags to enable useBlocker
const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        // Redirect root to French
        { path: "/", element: <Navigate to="/fr" replace /> },

        // Auth Routes
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },

        // French Routes
        { path: "/fr", element: <HomePage lang="fr" /> },
        { path: "/fr/catalogue", element: <CatalogPage lang="fr" /> },
        { path: "/fr/produit/:code", element: <ProductPage /> },
        { path: "/fr/entreprise", element: <CompanyPage lang="fr" /> },
        { path: "/fr/equipe", element: <TeamPage lang="fr" /> },
        { path: "/fr/actualites", element: <NewsPage lang="fr" /> },
        { path: "/fr/actualites/:slug", element: <BlogArticlePage lang="fr" /> },
        { path: "/fr/podcast", element: <PodcastPage lang="fr" /> },
        { path: "/fr/contact", element: <ContactPage lang="fr" /> },
        { path: "/fr/mon-compte", element: <ProtectedRoute><AccountPage lang="fr" /></ProtectedRoute> },

        // English Routes
        { path: "/en", element: <HomePage lang="en" /> },
        { path: "/en/catalogue", element: <CatalogPage lang="en" /> },
        { path: "/en/produit/:code", element: <ProductPage /> },
        { path: "/en/entreprise", element: <CompanyPage lang="en" /> },
        { path: "/en/equipe", element: <TeamPage lang="en" /> },
        { path: "/en/actualites", element: <NewsPage lang="en" /> },
        { path: "/en/actualites/:slug", element: <BlogArticlePage lang="en" /> },
        { path: "/en/podcast", element: <PodcastPage lang="en" /> },
        { path: "/en/contact", element: <ContactPage lang="en" /> },
        { path: "/en/my-account", element: <ProtectedRoute><AccountPage lang="en" /></ProtectedRoute> },

        // Admin Routes - Protected
        {
          path: "/admin",
          element: <AdminWrapper />,
          children: [
            { index: true, element: <AdminDashboard /> },
            { path: "demandes", element: <DemandesListPage /> },
            { path: "demandes/:id", element: <DemandeDetailPage /> },
            { path: "blog", element: <BlogListPage /> },
            { path: "blog/new", element: <BlogEditPage /> },
            { path: "blog/:id", element: <BlogEditPage /> },
            { path: "contacts", element: <ContactsListPage /> },
            { path: "cosmetiques", element: <CosmetiqueListPage /> },
            { path: "cosmetiques/new", element: <CosmetiqueEditPage /> },
            { path: "cosmetiques/:code", element: <CosmetiqueEditPage /> },
            { path: "parfums", element: <ParfumListPage /> },
            { path: "parfums/new", element: <ParfumEditPage /> },
            { path: "parfums/:code", element: <ParfumEditPage /> },
            { path: "parfums/:code/performance", element: <ParfumPerformancePage /> },
            { path: "aromes", element: <AromeListPage /> },
            { path: "aromes/new", element: <AromeEditPage /> },
            { path: "aromes/:code", element: <AromeEditPage /> },
            { path: "equipe", element: <TeamListPage /> },
            { path: "equipe/new", element: <TeamEditPage /> },
            { path: "equipe/:id", element: <TeamEditPage /> },
            { path: "utilisateurs", element: <UsersListPage /> },
            { path: "settings", element: <SettingsPage /> },
          ],
        },

        // 404
        { path: "*", element: <NotFound /> },
      ],
    },
  ]
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SampleCartProvider>
            <NotificationPreferencesProvider>
              <Toaster />
              <Sonner />
              <ErrorBoundary>
                <RouterProvider router={router} />
              </ErrorBoundary>
            </NotificationPreferencesProvider>
          </SampleCartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;