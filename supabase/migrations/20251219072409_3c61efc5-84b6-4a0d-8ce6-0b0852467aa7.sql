-- Ajouter les colonnes de traduction anglaise pour tous les champs texte
ALTER TABLE public.cosmetique_fr
ADD COLUMN IF NOT EXISTS nom_commercial_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS benefices_en TEXT,
ADD COLUMN IF NOT EXISTS benefices_aqueux_en TEXT,
ADD COLUMN IF NOT EXISTS benefices_huileux_en TEXT,
ADD COLUMN IF NOT EXISTS application_en TEXT,
ADD COLUMN IF NOT EXISTS type_de_peau_en TEXT,
ADD COLUMN IF NOT EXISTS aspect_en TEXT,
ADD COLUMN IF NOT EXISTS partie_utilisee_en TEXT,
ADD COLUMN IF NOT EXISTS solubilite_en TEXT,
ADD COLUMN IF NOT EXISTS conservateurs_en TEXT,
ADD COLUMN IF NOT EXISTS certifications_en TEXT,
ADD COLUMN IF NOT EXISTS valorisations_en TEXT,
ADD COLUMN IF NOT EXISTS tracabilite_en TEXT,
ADD COLUMN IF NOT EXISTS calendrier_des_recoltes_en TEXT,
ADD COLUMN IF NOT EXISTS is_translated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS translated_at TIMESTAMP WITH TIME ZONE;