"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart, Loader2, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getCategoryConfig } from "@/lib/product-types";
import { toast } from "sonner";

interface FavoriteProduct {
  id: string;
  product_code: string;
  product_table: string;
  created_at: string;
  // Product data fetched separately
  nom_commercial?: string;
  description?: string;
  image_url?: string;
  code_fournisseurs?: string;
  typography_de_produit?: string;
}

export default function FavorisPage() {
  const supabase = createClient();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: favs } = await (supabase.from("user_favorites") as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!favs || favs.length === 0) { setLoading(false); return; }

      // Fetch product details for each favorite
      const enriched: FavoriteProduct[] = [];
      for (const fav of favs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: product } = await (supabase.from(fav.product_table) as any)
          .select("nom_commercial, description, image_url, code_fournisseurs, typography_de_produit")
          .eq("code", fav.product_code)
          .maybeSingle();

        enriched.push({
          ...fav,
          nom_commercial: product?.nom_commercial || fav.product_code,
          description: product?.description || null,
          image_url: product?.image_url || null,
          code_fournisseurs: product?.code_fournisseurs || null,
          typography_de_produit: product?.typography_de_produit || null,
        });
      }

      setFavorites(enriched);
      setLoading(false);
    };

    fetchFavorites();
  }, [supabase]);

  const removeFavorite = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("user_favorites") as any).delete().eq("id", id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    toast.success("Retiré des favoris");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark tracking-tight">Mes favoris</h1>
          <p className="text-sm text-dark/40 mt-1">
            {favorites.length} produit{favorites.length !== 1 ? "s" : ""} sauvegardé{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center">
          <Heart className="w-10 h-10 text-dark/10 mx-auto mb-3" />
          <p className="text-sm text-dark/40 mb-4">Vous n&apos;avez pas encore de favoris</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Button asChild variant="outline" className="rounded-xl gap-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={"/catalogue" as any}>
              <Package className="w-4 h-4" />
              Explorer le catalogue
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => {
            const config = getCategoryConfig(fav.typography_de_produit || null, fav.product_table || null);
            return (
              <div
                key={fav.id}
                className="group bg-brand-primary rounded-2xl overflow-hidden flex flex-col transition-shadow duration-150 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              >
                {/* Image */}
                <div className="relative aspect-[3/1] overflow-hidden">
                  <Image
                    src={fav.image_url || config.image}
                    alt={fav.nom_commercial || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  {/* Remove button */}
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-150 hover:bg-red-500/80 z-10"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Content */}
                <Link
                  href={{
                    pathname: "/catalogue/produit/[code]",
                    params: { code: fav.product_code },
                  }}
                  className="p-5 flex flex-col flex-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: config.accent }} />
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-white/70">{config.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white/50 font-mono">
                      {fav.code_fournisseurs || "-"}
                    </span>
                  </div>

                  <h3 className="text-lg font-playfair font-semibold text-white leading-snug mb-2 line-clamp-2">
                    {fav.nom_commercial}
                  </h3>

                  {fav.description && (
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2">
                      {fav.description}
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
