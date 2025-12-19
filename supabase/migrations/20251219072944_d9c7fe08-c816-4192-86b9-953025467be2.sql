-- Supprimer les colonnes de traduction de cosmetique_fr
ALTER TABLE public.cosmetique_fr
DROP COLUMN IF EXISTS nom_commercial_en,
DROP COLUMN IF EXISTS description_en,
DROP COLUMN IF EXISTS benefices_en,
DROP COLUMN IF EXISTS benefices_aqueux_en,
DROP COLUMN IF EXISTS benefices_huileux_en,
DROP COLUMN IF EXISTS application_en,
DROP COLUMN IF EXISTS type_de_peau_en,
DROP COLUMN IF EXISTS aspect_en,
DROP COLUMN IF EXISTS partie_utilisee_en,
DROP COLUMN IF EXISTS solubilite_en,
DROP COLUMN IF EXISTS conservateurs_en,
DROP COLUMN IF EXISTS certifications_en,
DROP COLUMN IF EXISTS valorisations_en,
DROP COLUMN IF EXISTS tracabilite_en,
DROP COLUMN IF EXISTS calendrier_des_recoltes_en,
DROP COLUMN IF EXISTS is_translated,
DROP COLUMN IF EXISTS translated_at;

-- Créer la table cosmetique_en avec la même structure
CREATE TABLE public.cosmetique_en (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  nom_commercial TEXT,
  typologie_de_produit TEXT,
  gamme TEXT,
  origine TEXT,
  tracabilite TEXT,
  cas_no TEXT,
  inci TEXT,
  flavouring_preparation TEXT,
  benefices_aqueux TEXT,
  benefices_huileux TEXT,
  benefices TEXT,
  solubilite TEXT,
  partie_utilisee TEXT,
  description TEXT,
  aspect TEXT,
  conservateurs TEXT,
  application TEXT,
  type_de_peau TEXT,
  calendrier_des_recoltes TEXT,
  certifications TEXT,
  valorisations TEXT,
  statut TEXT DEFAULT 'ACTIF',
  source_id BIGINT,
  translated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.cosmetique_en ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Allow public read access for cosmetique_en"
ON public.cosmetique_en
FOR SELECT
USING (true);

-- Index pour les recherches
CREATE INDEX idx_cosmetique_en_code ON public.cosmetique_en(code);
CREATE INDEX idx_cosmetique_en_statut ON public.cosmetique_en(statut);
CREATE INDEX idx_cosmetique_en_gamme ON public.cosmetique_en(gamme);

-- Commentaire
COMMENT ON TABLE public.cosmetique_en IS 'English translations of cosmetic products';