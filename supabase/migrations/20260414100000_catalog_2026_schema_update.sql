-- ============================================================
-- Catalogue 2026 — Nouvelles colonnes
-- ============================================================

-- aromes_fr : famille aromatique + saveur
ALTER TABLE public.aromes_fr ADD COLUMN IF NOT EXISTS famille_arome TEXT;
ALTER TABLE public.aromes_fr ADD COLUMN IF NOT EXISTS saveur TEXT;

-- cosmetique_fr : famille cosmétique (ex: ACTIF, HUILE, BEURRE...)
ALTER TABLE public.cosmetique_fr ADD COLUMN IF NOT EXISTS famille_cosmetique TEXT;

-- parfum_fr : calendrier des récoltes
ALTER TABLE public.parfum_fr ADD COLUMN IF NOT EXISTS calendrier_recoltes TEXT;
