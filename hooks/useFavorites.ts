"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Favorite {
  id: string;
  product_code: string;
  product_table: string;
  created_at: string;
}

export function useFavorites() {
  const supabase = createClient();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth and load favorites
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase.from("user_favorites") as any)
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (data) setFavorites(data);
      }
      setLoading(false);
    };
    init();
  }, [supabase]);

  const isAuthenticated = userId !== null;

  const isFavorite = useCallback(
    (code: string) => favorites.some((f) => f.product_code === code),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (code: string, table: string) => {
      if (!userId) return false;

      const existing = favorites.find((f) => f.product_code === code);

      if (existing) {
        // Remove
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("user_favorites") as any)
          .delete()
          .eq("id", existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        return false;
      } else {
        // Add
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase.from("user_favorites") as any)
          .insert({ user_id: userId, product_code: code, product_table: table })
          .select()
          .single();
        if (data) setFavorites((prev) => [data, ...prev]);
        return true;
      }
    },
    [userId, favorites, supabase]
  );

  const removeFavorite = useCallback(
    async (code: string) => {
      const existing = favorites.find((f) => f.product_code === code);
      if (!existing) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("user_favorites") as any)
        .delete()
        .eq("id", existing.id);
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
    },
    [favorites, supabase]
  );

  return {
    favorites,
    isAuthenticated,
    loading,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    favoriteCount: favorites.length,
  };
}
