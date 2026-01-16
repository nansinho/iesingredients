import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  Droplets,
  Cookie,
  ClipboardList,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  User,
  Newspaper,
  Mail,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { usePendingRequestsCount } from "@/hooks/usePendingRequestsCount";
import { useUnreadContactsCount } from "@/hooks/useUnreadContactsCount";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/demandes", icon: ClipboardList, label: "Demandes" },
  { to: "/admin/blog", icon: Newspaper, label: "Blog" },
  { to: "/admin/contacts", icon: Mail, label: "Messages" },
  { to: "/admin/cosmetiques", icon: Sparkles, label: "Cosmétiques" },
  { to: "/admin/parfums", icon: Droplets, label: "Parfums" },
  { to: "/admin/aromes", icon: Cookie, label: "Arômes" },
  { to: "/admin/equipe", icon: Users, label: "Équipe" },
  { to: "/admin/settings", icon: Settings, label: "Paramètres" },
];

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { count: pendingCount, hasNewRequest } = usePendingRequestsCount();
  const { count: unreadContactsCount, hasNewMessage } = useUnreadContactsCount();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/fr");
  };

  // Helper to render badge for nav items
  const renderBadge = (itemTo: string, isActive: boolean) => {
    if (itemTo === "/admin/demandes" && pendingCount > 0) {
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-destructive text-destructive-foreground",
            hasNewRequest && "animate-pulse"
          )}
        >
          {pendingCount > 99 ? "99+" : pendingCount}
        </motion.span>
      );
    }
    if (itemTo === "/admin/contacts" && unreadContactsCount > 0) {
      return (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-blue-500 text-white",
            hasNewMessage && "animate-pulse"
          )}
        >
          {unreadContactsCount > 99 ? "99+" : unreadContactsCount}
        </motion.span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed 100vh with internal scroll */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Fixed */}
          <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
            <NavLink to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IES</span>
              </div>
              <span className="font-semibold text-foreground text-lg">Admin</span>
            </NavLink>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info - Fixed */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || user?.email?.split("@")[0] || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {renderBadge(item.to, isActive)}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer actions - Fixed */}
          <div className="p-4 border-t border-border space-y-2 shrink-0">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs text-muted-foreground">Thème</span>
              <ThemeToggle />
            </div>
            <NavLink
              to="/fr"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour au site
            </NavLink>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-500/10 w-full"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content - offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-semibold">IES Admin</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Page content with animations */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
        <div className="flex justify-around py-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors min-h-[52px] justify-center rounded-lg relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )
              }
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.to === "/admin/demandes" && pendingCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground",
                      hasNewRequest && "animate-pulse"
                    )}
                  >
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </motion.span>
                )}
                {item.to === "/admin/contacts" && unreadContactsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full bg-blue-500 text-white",
                      hasNewMessage && "animate-pulse"
                    )}
                  >
                    {unreadContactsCount > 9 ? "9+" : unreadContactsCount}
                  </motion.span>
                )}
              </div>
              <span className="truncate max-w-[60px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
