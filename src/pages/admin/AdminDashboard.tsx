import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Droplets, Cookie, Package, Image, ClipboardList, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  cosmetiques: number;
  parfums: number;
  aromes: number;
  withImages: number;
  pendingRequests: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<Stats> => {
      const [cosmetiques, parfums, aromes, pendingRequests] = await Promise.all([
        supabase.from("cosmetique_fr").select("id, image_url", { count: "exact", head: false }),
        supabase.from("parfum_fr").select("id, image_url", { count: "exact", head: false }),
        supabase.from("aromes_fr").select("id, image_url", { count: "exact", head: false }),
        supabase.from("sample_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
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
      };
    },
  });

  const cards = [
    {
      title: "Demandes en attente",
      value: stats?.pendingRequests || 0,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      to: "/admin/demandes",
    },
    {
      title: "Cosmétiques",
      value: stats?.cosmetiques || 0,
      icon: Sparkles,
      color: "text-cosmetique",
      bgColor: "bg-cosmetique/10",
      to: "/admin/cosmetiques",
    },
    {
      title: "Parfums",
      value: stats?.parfums || 0,
      icon: Droplets,
      color: "text-parfum",
      bgColor: "bg-parfum/10",
      to: "/admin/parfums",
    },
    {
      title: "Arômes",
      value: stats?.aromes || 0,
      icon: Cookie,
      color: "text-arome",
      bgColor: "bg-arome/10",
      to: "/admin/aromes",
    },
    {
      title: "Avec images",
      value: stats?.withImages || 0,
      icon: Image,
      color: "text-primary",
      bgColor: "bg-primary/10",
      to: null,
    },
  ];

  const total = (stats?.cosmetiques || 0) + (stats?.parfums || 0) + (stats?.aromes || 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de votre catalogue produits
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="relative overflow-hidden hover:shadow-md transition-shadow"
          >
            {card.to ? (
              <NavLink to={card.to} className="absolute inset-0 z-10" />
            ) : null}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Total des produits</CardTitle>
          <div className="p-2 rounded-lg bg-primary/20">
            <Package className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-primary">{total.toLocaleString()}</p>
              <span className="text-muted-foreground">références</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NavLink
          to="/admin/cosmetiques"
          className="group p-6 rounded-xl border border-border bg-card hover:border-cosmetique/50 hover:bg-cosmetique/5 transition-all"
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
          className="group p-6 rounded-xl border border-border bg-card hover:border-parfum/50 hover:bg-parfum/5 transition-all"
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
          className="group p-6 rounded-xl border border-border bg-card hover:border-arome/50 hover:bg-arome/5 transition-all"
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
