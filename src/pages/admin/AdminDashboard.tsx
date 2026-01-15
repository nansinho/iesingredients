import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Droplets, Cookie, Package, Image, Clock, Mail, FileText, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  cosmetiques: number;
  parfums: number;
  aromes: number;
  withImages: number;
  pendingRequests: number;
  newContacts: number;
  publishedArticles: number;
  activeTeamMembers: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<Stats> => {
      const [cosmetiques, parfums, aromes, pendingRequests, contacts, articles, teamMembers] = await Promise.all([
        supabase.from("cosmetique_fr").select("id, image_url", { count: "exact", head: false }),
        supabase.from("parfum_fr").select("id, image_url", { count: "exact", head: false }),
        supabase.from("aromes_fr").select("id, image_url", { count: "exact", head: false }),
        supabase.from("sample_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("blog_articles").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("team_members").select("*", { count: "exact", head: true }).eq("is_active", true),
      ]);

      const allProducts = [
        ...(cosmetiques.data || []),
        ...(parfums.data || []),
        ...(aromes.data || []),
      ];

      const withImages = allProducts.filter((p) => p.image_url).length;

      return {
        cosmetiques: cosmetiques.count || 0,
        parfums: parfums.count || 0,
        aromes: aromes.count || 0,
        withImages,
        pendingRequests: pendingRequests.count || 0,
        newContacts: contacts.count || 0,
        publishedArticles: articles.count || 0,
        activeTeamMembers: teamMembers.count || 0,
      };
    },
  });

  const total = (stats?.cosmetiques || 0) + (stats?.parfums || 0) + (stats?.aromes || 0);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <AdminPageHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de votre catalogue produits"
      />

      {/* Alerts section */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Alertes & Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            title="Demandes en attente"
            value={stats?.pendingRequests || 0}
            icon={Clock}
            variant="warning"
            to="/admin/demandes"
            isLoading={isLoading}
          />
          <StatCard
            title="Messages non lus"
            value={stats?.newContacts || 0}
            icon={Mail}
            variant="warning"
            to="/admin/contacts"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Catalogue section */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Catalogue</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            title="Cosmétiques"
            value={stats?.cosmetiques || 0}
            icon={Sparkles}
            variant="cosmetique"
            to="/admin/cosmetiques"
            isLoading={isLoading}
          />
          <StatCard
            title="Parfums"
            value={stats?.parfums || 0}
            icon={Droplets}
            variant="parfum"
            to="/admin/parfums"
            isLoading={isLoading}
          />
          <StatCard
            title="Arômes"
            value={stats?.aromes || 0}
            icon={Cookie}
            variant="arome"
            to="/admin/aromes"
            isLoading={isLoading}
          />
          <StatCard
            title="Avec images"
            value={stats?.withImages || 0}
            icon={Image}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Content section */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Contenu</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            title="Articles publiés"
            value={stats?.publishedArticles || 0}
            icon={FileText}
            variant="info"
            to="/admin/blog"
            isLoading={isLoading}
          />
          <StatCard
            title="Membres équipe"
            value={stats?.activeTeamMembers || 0}
            icon={Users}
            variant="success"
            to="/admin/equipe"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Total card */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Total des produits</CardTitle>
          <div className="p-2.5 rounded-lg bg-primary/20">
            <Package className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <div className="flex items-baseline gap-2">
              <p className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {total.toLocaleString()}
              </p>
              <span className="text-muted-foreground">références</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <NavLink
          to="/admin/cosmetiques"
          className="group p-5 md:p-6 rounded-xl border border-border bg-card hover:border-cosmetique/50 hover:bg-cosmetique/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <Sparkles className="h-8 w-8 text-cosmetique mb-4" />
          <h3 className="font-semibold text-foreground group-hover:text-cosmetique transition-colors">
            Gérer les cosmétiques
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Import CSV, édition, images
          </p>
        </NavLink>

        <NavLink
          to="/admin/parfums"
          className="group p-5 md:p-6 rounded-xl border border-border bg-card hover:border-parfum/50 hover:bg-parfum/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <Droplets className="h-8 w-8 text-parfum mb-4" />
          <h3 className="font-semibold text-foreground group-hover:text-parfum transition-colors">
            Gérer les parfums
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Performance, stabilité, odeurs
          </p>
        </NavLink>

        <NavLink
          to="/admin/aromes"
          className="group p-5 md:p-6 rounded-xl border border-border bg-card hover:border-arome/50 hover:bg-arome/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <Cookie className="h-8 w-8 text-arome mb-4" />
          <h3 className="font-semibold text-foreground group-hover:text-arome transition-colors">
            Gérer les arômes
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Import CSV, édition, images
          </p>
        </NavLink>
      </div>
    </div>
  );
}
