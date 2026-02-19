import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Sparkles,
  Droplets,
  Cookie,
  ClipboardList,
  Mail,
  Newspaper,
  Users,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    const supabase = await createClient();

    const [cosmetique, parfum, aromes, requests, contacts, articles, team] =
      await Promise.all([
        supabase.from("cosmetique_fr").select("*", { count: "exact", head: true }).eq("statut", "ACTIF"),
        supabase.from("parfum_fr").select("*", { count: "exact", head: true }).eq("statut", "ACTIF"),
        supabase.from("aromes_fr").select("*", { count: "exact", head: true }).eq("statut", "ACTIF"),
        supabase.from("sample_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("blog_articles").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("team_members").select("*", { count: "exact", head: true }),
      ]);

    return {
      cosmetiques: cosmetique.count ?? 0,
      parfums: parfum.count ?? 0,
      aromes: aromes.count ?? 0,
      pendingRequests: requests.count ?? 0,
      newContacts: contacts.count ?? 0,
      publishedArticles: articles.count ?? 0,
      teamMembers: team.count ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      cosmetiques: 0,
      parfums: 0,
      aromes: 0,
      pendingRequests: 0,
      newContacts: 0,
      publishedArticles: 0,
      teamMembers: 0,
    };
  }
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  variant?: "default" | "warning" | "cosmetique" | "parfum" | "arome";
}) {
  const variants = {
    default: "bg-white border-gray-200 [&_.icon]:bg-forest-100 [&_.icon]:text-forest-600 [&_.value]:text-forest-900",
    warning: "bg-amber-50 border-amber-200 [&_.icon]:bg-amber-100 [&_.icon]:text-amber-600 [&_.value]:text-amber-700",
    cosmetique: "bg-emerald-50 border-emerald-200 [&_.icon]:bg-emerald-100 [&_.icon]:text-emerald-600 [&_.value]:text-emerald-700",
    parfum: "bg-purple-50 border-purple-200 [&_.icon]:bg-purple-100 [&_.icon]:text-purple-600 [&_.value]:text-purple-700",
    arome: "bg-orange-50 border-orange-200 [&_.icon]:bg-orange-100 [&_.icon]:text-orange-600 [&_.value]:text-orange-700",
  };

  return (
    <Link
      href={href}
      className={`block p-5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${variants[variant]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="value text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="icon w-12 h-12 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Link>
  );
}

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const stats = await getStats();

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle="Vue d'ensemble de votre plateforme" />

      {/* Alerts */}
      {(stats.pendingRequests > 0 || stats.newContacts > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stats.pendingRequests > 0 && (
            <StatCard
              title="Demandes en attente"
              value={stats.pendingRequests}
              icon={ClipboardList}
              href={`/${locale}/admin/demandes`}
              variant="warning"
            />
          )}
          {stats.newContacts > 0 && (
            <StatCard
              title="Messages non lus"
              value={stats.newContacts}
              icon={Mail}
              href={`/${locale}/admin/contacts`}
              variant="warning"
            />
          )}
        </div>
      )}

      {/* Catalogue Stats */}
      <h2 className="text-lg font-semibold text-forest-900 mb-4">Catalogue</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Cosmétiques"
          value={stats.cosmetiques}
          icon={Sparkles}
          href={`/${locale}/admin/cosmetiques`}
          variant="cosmetique"
        />
        <StatCard
          title="Parfums"
          value={stats.parfums}
          icon={Droplets}
          href={`/${locale}/admin/parfums`}
          variant="parfum"
        />
        <StatCard
          title="Arômes"
          value={stats.aromes}
          icon={Cookie}
          href={`/${locale}/admin/aromes`}
          variant="arome"
        />
        <StatCard
          title="Total Produits"
          value={stats.cosmetiques + stats.parfums + stats.aromes}
          icon={ImageIcon}
          href={`/${locale}/admin/cosmetiques`}
        />
      </div>

      {/* Content Stats */}
      <h2 className="text-lg font-semibold text-forest-900 mb-4">Contenu</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Articles publiés"
          value={stats.publishedArticles}
          icon={Newspaper}
          href={`/${locale}/admin/blog`}
        />
        <StatCard
          title="Membres équipe"
          value={stats.teamMembers}
          icon={Users}
          href={`/${locale}/admin/equipe`}
        />
      </div>
    </>
  );
}
