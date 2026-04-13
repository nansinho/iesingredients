import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import {
  Sparkles,
  Droplets,
  Cookie,
  ClipboardList,
  Mail,
  Newspaper,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

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
        <p className="text-sm text-brand-secondary/70 truncate">{title}</p>
        <p className="text-2xl font-bold text-brand-primary tracking-tight mt-0.5">{value}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-brand-primary/0 group-hover:text-brand-primary/40 transition-all duration-300 shrink-0" />
    </Link>
  );
}

function AlertCard({
  title,
  value,
  icon: Icon,
  href,
  label,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl bg-brand-accent/[0.06] p-5 transition-all duration-300 hover:bg-brand-accent/[0.1]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent/15">
        <Icon className="h-5 w-5 text-brand-accent" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-primary">{title}</p>
        <p className="text-xs text-brand-secondary/60 mt-0.5">{label}</p>
      </div>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-white text-sm font-bold">
        {value}
      </span>
    </Link>
  );
}

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [stats, profile] = await Promise.all([getStats(), getProfile()]);
  const greeting = getGreeting();
  const firstName = profile?.full_name?.split(" ")[0] || "Admin";
  const totalProducts = stats.cosmetiques + stats.parfums + stats.aromes;

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
        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary tracking-tight">
          {greeting}, {firstName}
        </h1>
        <p className="text-sm text-brand-secondary/60 mt-1 capitalize">{today}</p>
      </div>

      {/* Alerts */}
      {(stats.pendingRequests > 0 || stats.newContacts > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {stats.pendingRequests > 0 && (
            <AlertCard
              title={`${stats.pendingRequests} demande${stats.pendingRequests > 1 ? "s" : ""} en attente`}
              value={stats.pendingRequests}
              icon={ClipboardList}
              href={`/${locale}/admin/demandes`}
              label="Échantillons à traiter"
            />
          )}
          {stats.newContacts > 0 && (
            <AlertCard
              title={`${stats.newContacts} message${stats.newContacts > 1 ? "s" : ""} non lu${stats.newContacts > 1 ? "s" : ""}`}
              value={stats.newContacts}
              icon={Mail}
              href={`/${locale}/admin/contacts`}
              label="Formulaire de contact"
            />
          )}
        </div>
      )}

      {/* Quick overview */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/[0.06]">
          <TrendingUp className="h-4 w-4 text-brand-primary/60" strokeWidth={2} />
        </div>
        <h2 className="text-sm font-semibold text-brand-primary/80 uppercase tracking-wider">Catalogue</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <StatCard
          title="Cosmétiques"
          value={stats.cosmetiques}
          icon={Sparkles}
          href={`/${locale}/admin/cosmetiques`}
          color="#5B7B6B"
        />
        <StatCard
          title="Parfums"
          value={stats.parfums}
          icon={Droplets}
          href={`/${locale}/admin/parfums`}
          color="#8B6A80"
        />
        <StatCard
          title="Arômes"
          value={stats.aromes}
          icon={Cookie}
          href={`/${locale}/admin/aromes`}
          color="#D4907E"
        />
        <StatCard
          title="Total Produits"
          value={totalProducts}
          icon={Package}
          href={`/${locale}/admin/cosmetiques`}
          color="#2E1F3D"
        />
      </div>

      {/* Content */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/[0.06]">
          <Newspaper className="h-4 w-4 text-brand-primary/60" strokeWidth={2} />
        </div>
        <h2 className="text-sm font-semibold text-brand-primary/80 uppercase tracking-wider">Contenu</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Articles publiés"
          value={stats.publishedArticles}
          icon={Newspaper}
          href={`/${locale}/admin/blog`}
          color="#2E1F3D"
        />
        <StatCard
          title="Membres équipe"
          value={stats.teamMembers}
          icon={Users}
          href={`/${locale}/admin/equipe`}
          color="#2E1F3D"
        />
      </div>
    </div>
  );
}
