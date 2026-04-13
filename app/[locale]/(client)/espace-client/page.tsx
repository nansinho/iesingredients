import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { getEffectiveProfile } from "@/lib/impersonate";
import {
  ClipboardList,
  Package,
  Clock,
  CheckCircle,
  ArrowUpRight,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import { DashboardCart } from "@/components/client/DashboardCart";

async function getClientStats(userId: string) {
  try {
    const supabase = await createClient();

    const [total, pending, delivered] = await Promise.all([
      (supabase.from("sample_requests") as ReturnType<typeof supabase.from>)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      (supabase.from("sample_requests") as ReturnType<typeof supabase.from>)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("status", ["pending", "processing"]),
      (supabase.from("sample_requests") as ReturnType<typeof supabase.from>)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "delivered"),
    ]);

    // Recent requests
    const { data: recent } = await (supabase.from("sample_requests") as ReturnType<typeof supabase.from>)
      .select("*, sample_request_items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    return {
      totalRequests: total.count ?? 0,
      pendingRequests: pending.count ?? 0,
      deliveredRequests: delivered.count ?? 0,
      recentRequests: (recent ?? []) as Array<{
        id: string;
        status: string;
        created_at: string;
        sample_request_items: Array<{ product_name: string }>;
      }>,
    };
  } catch (error) {
    console.error("Failed to fetch client stats:", error);
    return { totalRequests: 0, pendingRequests: 0, deliveredRequests: 0, recentRequests: [] };
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "#F59E0B" },
  processing: { label: "En cours", color: "#3B82F6" },
  shipped: { label: "Expédié", color: "#8B5CF6" },
  delivered: { label: "Livré", color: "#10B981" },
  cancelled: { label: "Annulé", color: "#EF4444" },
};

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon className="h-5.5 w-5.5" style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-dark/50 truncate">{title}</p>
        <p className="text-2xl font-bold text-dark tracking-tight mt-0.5">{value}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-dark/0 group-hover:text-dark/40 transition-all duration-300 shrink-0" />
    </Link>
  );
}

export default async function ClientDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await getEffectiveProfile();
  const userId = profile?.id || "";
  const stats = await getClientStats(userId);
  const greeting = getGreeting();
  const firstName = profile?.full_name?.split(" ")[0] || "Client";
  const company = (profile as Record<string, unknown>)?.company as string || "";

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-dark tracking-tight">
          {greeting}, {firstName}
        </h1>
        <p className="text-sm text-dark/40 mt-1">
          {company && <span className="font-medium text-dark/60">{company}</span>}
          {company && " — "}
          <span className="capitalize">{today}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <StatCard
          title="Total demandes"
          value={stats.totalRequests}
          icon={Package}
          href={`/${locale}/espace-client/demandes`}
          color="#2E1F3D"
        />
        <StatCard
          title="En cours"
          value={stats.pendingRequests}
          icon={Clock}
          href={`/${locale}/espace-client/demandes`}
          color="#F59E0B"
        />
        <StatCard
          title="Livrées"
          value={stats.deliveredRequests}
          icon={CheckCircle}
          href={`/${locale}/espace-client/demandes`}
          color="#10B981"
        />
      </div>

      {/* Sample cart */}
      <DashboardCart />

      {/* Recent requests */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark/[0.06]">
          <ClipboardList className="h-4 w-4 text-dark/60" strokeWidth={2} />
        </div>
        <h2 className="text-sm font-semibold text-dark/80 uppercase tracking-wider">Dernières demandes</h2>
      </div>

      {stats.recentRequests.length > 0 ? (
        <div className="space-y-3 mb-10">
          {stats.recentRequests.map((req) => {
            const statusConf = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            const products = req.sample_request_items?.map((i) => i.product_name).join(", ") || "—";
            return (
              <Link
                key={req.id}
                href={`/${locale}/espace-client/demandes`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${statusConf.color}15` }}
                >
                  <ClipboardList className="h-4 w-4" style={{ color: statusConf.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{products}</p>
                  <p className="text-xs text-dark/40 mt-0.5">
                    {new Date(req.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: `${statusConf.color}15`, color: statusConf.color }}
                >
                  {statusConf.label}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center mb-10">
          <Package className="w-10 h-10 text-dark/20 mx-auto mb-3" />
          <p className="text-sm text-dark/40">Aucune demande pour le moment</p>
          <Link
            href={`/${locale}/catalogue`}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-accent hover:underline"
          >
            Découvrir le catalogue
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark/[0.06]">
          <LifeBuoy className="h-4 w-4 text-dark/60" strokeWidth={2} />
        </div>
        <h2 className="text-sm font-semibold text-dark/80 uppercase tracking-wider">Accès rapide</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href={`/${locale}/catalogue`}
          className="group flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10">
            <Package className="h-5 w-5 text-brand-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark">Explorer le catalogue</p>
            <p className="text-xs text-dark/40 mt-0.5">Cosmétiques, parfums, arômes</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-dark/0 group-hover:text-dark/40 transition-all ml-auto" />
        </Link>
        <Link
          href={`/${locale}/espace-client/support`}
          className="group flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <LifeBuoy className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-dark">Contacter le support</p>
            <p className="text-xs text-dark/40 mt-0.5">Une question ? On est là</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-dark/0 group-hover:text-dark/40 transition-all ml-auto" />
        </Link>
      </div>
    </div>
  );
}
