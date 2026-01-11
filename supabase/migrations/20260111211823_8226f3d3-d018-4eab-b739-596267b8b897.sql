-- Créer la table aromes_fr pour les arômes
CREATE TABLE public.aromes_fr (
  id BIGSERIAL PRIMARY KEY,
  nom_commercial TEXT,
  typologie_de_produit TEXT DEFAULT 'AROME',
  gamme TEXT,
  origine TEXT,
  tracabilite TEXT,
  code TEXT UNIQUE,
  cas_no TEXT,
  inci TEXT,
  food_grade TEXT,
  flavouring_preparation TEXT,
  profil_aromatique TEXT,
  description TEXT,
  aspect TEXT,
  application TEXT,
  dosage TEXT,
  ph TEXT,
  base TEXT,
  conservateurs TEXT,
  certifications TEXT,
  valorisations TEXT,
  statut TEXT DEFAULT 'ACTIF'
);

-- Activer RLS
ALTER TABLE public.aromes_fr ENABLE ROW LEVEL SECURITY;

-- Policy pour lecture publique
CREATE POLICY "Allow public read access" ON public.aromes_fr FOR SELECT USING (true);