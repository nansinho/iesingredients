import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { getEffectiveProfile } from "@/lib/impersonate";
import {
  ClipboardList,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "En attente", color: "#F59E0B", icon: Clock },
  processing: { label: "En cours", color: "#3B82F6", icon: ClipboardList },
  shipped: { label: "Expédié", color: "#8B5CF6", icon: Truck },
  delivered: { label: "Livré", color: "#10B981", icon: CheckCircle },
  cancelled: { label: "Annulé", color: "#EF4444", icon: XCircle },
};

export default async function ClientDemandesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const effectiveProfile = await getEffectiveProfile();
  const effectiveUserId = effectiveProfile?.id;
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: requests } = await (supabase.from("sample_requests") as any)
    .select("*, sample_request_items(*)")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false });

  const allRequests = (requests ?? []) as Array<{
    id: string;
    status: string;
    created_at: string;
    contact_name: string;
    contact_email: string;
    company: string;
    message: string;
    sample_request_items: Array<{
      id: string;
      product_name: string;
      product_code: string;
      product_category: string;
      quantity: number;
    }>;
  }>;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-dark tracking-tight">
          Mes demandes
        </h1>
        <p className="text-sm text-dark/40 mt-1">
          Historique de vos demandes d&apos;échantillons
        </p>
      </div>

      {allRequests.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center">
          <Package className="w-12 h-12 text-dark/15 mx-auto mb-4" />
          <p className="text-dark/50 mb-2">Aucune demande pour le moment</p>
          <Link
            href={`/${locale}/catalogue`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:underline"
          >
            Découvrir le catalogue
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {allRequests.map((req) => {
            const statusConf = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConf.icon;
            return (
              <div
                key={req.id}
                className="rounded-2xl bg-white p-5 transition-all duration-300"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${statusConf.color}15` }}
                    >
                      <StatusIcon className="h-4.5 w-4.5" style={{ color: statusConf.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark">
                        Demande du {new Date(req.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-xs text-dark/40 mt-0.5 font-mono">
                        #{req.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: `${statusConf.color}15`, color: statusConf.color }}
                  >
                    {statusConf.label}
                  </span>
                </div>

                {/* Products */}
                {req.sample_request_items.length > 0 && (
                  <div className="border-t border-brown/8 pt-3">
                    <div className="space-y-2">
                      {req.sample_request_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                            <span className="text-dark/70">{item.product_name}</span>
                            {item.product_code && (
                              <span className="text-[11px] font-mono text-dark/30">{item.product_code}</span>
                            )}
                          </div>
                          <span className="text-xs text-dark/40">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                {req.message && (
                  <div className="border-t border-brown/8 pt-3 mt-3">
                    <p className="text-xs text-dark/40 italic">&ldquo;{req.message}&rdquo;</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
