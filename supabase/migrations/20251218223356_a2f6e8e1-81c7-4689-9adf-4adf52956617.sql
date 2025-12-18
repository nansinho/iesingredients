-- Ajouter colonne statut pour soft delete (delta sync)
ALTER TABLE cosmetique_fr 
ADD COLUMN IF NOT EXISTS statut text DEFAULT 'ACTIF';

-- Index pour filtrer rapidement les produits actifs
CREATE INDEX IF NOT EXISTS idx_cosmetique_fr_statut ON cosmetique_fr(statut);

-- Mettre tous les produits existants en ACTIF
UPDATE cosmetique_fr SET statut = 'ACTIF' WHERE statut IS NULL;