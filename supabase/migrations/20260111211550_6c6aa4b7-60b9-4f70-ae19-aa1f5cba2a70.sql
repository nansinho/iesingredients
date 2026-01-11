-- Créer la table parfum_fr pour les parfums
CREATE TABLE public.parfum_fr (
  id BIGSERIAL PRIMARY KEY,
  nom_commercial TEXT,
  typologie_de_produit TEXT DEFAULT 'PARFUM',
  famille_olfactive TEXT,
  origine TEXT,
  tracabilite TEXT,
  code TEXT UNIQUE,
  cas_no TEXT,
  nom_latin TEXT,
  food_grade TEXT,
  flavouring_preparation TEXT,
  profil_olfactif TEXT,
  description TEXT,
  aspect TEXT,
  calendrier_des_recoltes TEXT,
  performance TEXT,
  ph TEXT,
  base TEXT,
  odeur TEXT,
  certifications TEXT,
  valorisations TEXT,
  statut TEXT DEFAULT 'ACTIF'
);

-- Activer RLS
ALTER TABLE public.parfum_fr ENABLE ROW LEVEL SECURITY;

-- Policy pour lecture publique
CREATE POLICY "Allow public read access" ON public.parfum_fr FOR SELECT USING (true);