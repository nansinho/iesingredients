"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  LifeBuoy,
  MessageCircle,
  Package,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  ticket_created: { icon: LifeBuoy, color: "#F59E0B", label: "Ticket" },
  ticket_reply: { icon: MessageCircle, color: "#3B82F6", label: "Réponse" },
  ticket_status: { icon: Info, color: "#8B5CF6", label: "Statut" },
  order_status: { icon: Package, color: "#10B981", label: "Commande" },
  system: { icon: Bell, color: "#6B7280", label: "Système" },
};

export default function NotificationsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await (supabase.from("notifications") as ReturnType<typeof supabase.from>)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setNotifications(data as unknown as Notification[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time
  useEffect(() => {
    const channel = supabase
      .channel("notifications-page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => { fetchNotifications(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetchNotifications]);

  const markAsRead = async (id: string) => {
    await (supabase.from("notifications") as ReturnType<typeof supabase.from>)
      .update({ read: true })
      .eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await (supabase.from("notifications") as ReturnType<typeof supabase.from>)
      .update({ read: true })
      .in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
    await (supabase.from("notifications") as ReturnType<typeof supabase.from>)
      .delete()
      .eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = async () => {
    const ids = notifications.map((n) => n.id);
    if (ids.length === 0) return;

    await (supabase.from("notifications") as ReturnType<typeof supabase.from>)
      .delete()
      .in("id", ids);
    setNotifications([]);
  };

  const handleClick = (notif: Notification) => {
    if (!notif.read) markAsRead(notif.id);
    if (notif.link) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(notif.link as any);
    }
  };

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    if (diffD < 7) return `Il y a ${diffD} jour${diffD > 1 ? "s" : ""}`;
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">Notifications</h1>
          <p className="text-sm text-dark/40 mt-1">
            {unreadCount > 0
              ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
              : "Tout est lu"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs gap-1.5 rounded-xl"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tout marquer lu
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="h-8 text-xs gap-1.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
            filter === "all"
              ? "bg-dark text-white"
              : "bg-brown/5 text-dark/50 hover:bg-brown/10"
          )}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
            filter === "unread"
              ? "bg-brand-accent text-white"
              : "bg-brown/5 text-dark/50 hover:bg-brown/10"
          )}
        >
          Non lues ({unreadCount})
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center">
          <Bell className="w-10 h-10 text-dark/10 mx-auto mb-3" />
          <p className="text-sm text-dark/40">
            {filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl bg-white p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
                  !notif.read && "ring-1 ring-brand-accent/20 bg-brand-accent/[0.02]"
                )}
                onClick={() => handleClick(notif)}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${config.color}12` }}
                >
                  <Icon className="h-5 w-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm", notif.read ? "text-dark/60" : "font-semibold text-dark")}>
                      {notif.title}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: `${config.color}12`, color: config.color }}
                    >
                      {config.label}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-accent shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-dark/50 mt-1">{notif.message}</p>
                  <p className="text-xs text-dark/30 mt-2">{formatDate(notif.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                  {!notif.read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                      className="p-1.5 rounded-xl hover:bg-brown/10 text-dark/30 hover:text-dark/60"
                      title="Marquer comme lu"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="p-1.5 rounded-xl hover:bg-red-50 text-dark/30 hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
