-- Favoris utilisateur
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_code text NOT NULL,
  product_table text NOT NULL CHECK (product_table IN ('aromes_fr', 'cosmetique_fr', 'parfum_fr')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_code, product_table)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_favorites;
