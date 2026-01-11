-- Table pour les données de stabilité des parfums (pH/Base/Odeur)
CREATE TABLE parfum_stabilite (
  id BIGSERIAL PRIMARY KEY,
  product_code TEXT NOT NULL,
  ordre INTEGER NOT NULL,
  ph_value TEXT,
  base_name TEXT NOT NULL,
  odeur_rating INTEGER CHECK (odeur_rating >= 0 AND odeur_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_code, ordre)
);

CREATE INDEX idx_parfum_stabilite_product_code ON parfum_stabilite(product_code);

ALTER TABLE parfum_stabilite ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON parfum_stabilite FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON parfum_stabilite FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON parfum_stabilite FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON parfum_stabilite FOR DELETE USING (true);

-- Table pour les données de performance des parfums (Option/Performance)
CREATE TABLE parfum_performance (
  id BIGSERIAL PRIMARY KEY,
  product_code TEXT NOT NULL,
  ordre INTEGER NOT NULL,
  option_name TEXT,
  performance_rating INTEGER CHECK (performance_rating >= 0 AND performance_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_code, ordre)
);

CREATE INDEX idx_parfum_performance_product_code ON parfum_performance(product_code);

ALTER TABLE parfum_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON parfum_performance FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON parfum_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON parfum_performance FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON parfum_performance FOR DELETE USING (true);

-- Ajouter colonne image_url aux 3 tables produits
ALTER TABLE cosmetique_fr ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE parfum_fr ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE aromes_fr ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Créer le bucket pour les images produits
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Politique de lecture publique pour les images
CREATE POLICY "Public read access for product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Politique d'upload pour les images (tout le monde peut uploader pour l'instant)
CREATE POLICY "Allow upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- Politique de suppression pour les images
CREATE POLICY "Allow delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- Politique de mise à jour pour les images
CREATE POLICY "Allow update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');