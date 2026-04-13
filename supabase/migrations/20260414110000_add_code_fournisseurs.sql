-- Ajouter code_fournisseurs à chaque table catalogue
-- Le code_fournisseurs est le code fourni par le fournisseur (peut être dupliqué ou null)
-- Le champ "code" reste la clé unique interne pour le routing

ALTER TABLE public.aromes_fr ADD COLUMN IF NOT EXISTS code_fournisseurs TEXT;
ALTER TABLE public.cosmetique_fr ADD COLUMN IF NOT EXISTS code_fournisseurs TEXT;
ALTER TABLE public.parfum_fr ADD COLUMN IF NOT EXISTS code_fournisseurs TEXT;
