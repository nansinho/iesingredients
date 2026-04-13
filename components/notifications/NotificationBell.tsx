"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, Check, CheckCheck, Trash2, LifeBuoy, MessageCircle, Package, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string }> = {
  ticket_created: { icon: LifeBuoy, color: "#F59E0B" },
  ticket_reply: { icon: MessageCircle, color: "#3B82F6" },
  ticket_status: { icon: Info, color: "#8B5CF6" },
  order_status: { icon: Package, color: "#10B981" },
  system: { icon: Bell, color: "#6B7280" },
};

interface NotificationBellProps {
  /** Style variant for admin vs client header */
  variant?: "client" | "admin";
}

export function NotificationBell({ variant = "client" }: NotificationBellProps) {
  const supabase = createClient();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await (supabase.from("notifications") as ReturnType<typeof supabase.from>)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setNotifications(data as unknown as Notification[]);
  }, [supabase]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("notifications-bell")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotif.id)) return prev;
            return [newNotif, ...prev].slice(0, 20);
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          const updated = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "notifications" },
        (payload) => {
          const deleted = payload.old as { id: string };
          setNotifications((prev) => prev.filter((n) => n.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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

  const handleClick = (notif: Notification) => {
    if (!notif.read) markAsRead(notif.id);
    if (notif.link) {
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(notif.link as any);
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `${diffMin} min`;
    if (diffH < 24) return `${diffH}h`;
    if (diffD < 7) return `${diffD}j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const isAdmin = variant === "admin";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-xl transition-colors",
            isAdmin
              ? "text-brand-secondary/40 hover:text-brand-primary hover:bg-brand-primary/[0.04]"
              : "text-dark/40 hover:text-dark hover:bg-brown/5"
          )}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-accent text-white text-[10px] font-bold leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 rounded-2xl border-brown/10 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-brown/8">
          <h3 className="text-sm font-bold text-dark">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[11px] text-brand-accent hover:text-brand-accent-hover font-medium transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tout marquer lu
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="w-8 h-8 text-dark/10 mb-2" />
              <p className="text-sm text-dark/40">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  className={cn(
                    "group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-brown/5 last:border-0",
                    notif.read
                      ? "hover:bg-brown/3"
                      : "bg-brand-accent/[0.04] hover:bg-brand-accent/[0.08]"
                  )}
                  onClick={() => handleClick(notif)}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5"
                    style={{ backgroundColor: `${config.color}12` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm truncate", notif.read ? "text-dark/60" : "font-semibold text-dark")}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-accent shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-dark/40 mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-dark/25 mt-1">{formatTime(notif.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                    {!notif.read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                        className="p-1 rounded-lg hover:bg-brown/10 text-dark/30 hover:text-dark/60"
                        title="Marquer comme lu"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                      className="p-1 rounded-lg hover:bg-red-50 text-dark/30 hover:text-red-500"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-brown/8 px-4 py-2.5">
            <button
              onClick={() => {
                setOpen(false);
                const path = isAdmin ? "/admin/notifications" : "/espace-client/notifications";
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                router.push(path as any);
              }}
              className="text-xs font-medium text-brand-accent hover:text-brand-accent-hover transition-colors w-full text-center"
            >
              Voir toutes les notifications
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
