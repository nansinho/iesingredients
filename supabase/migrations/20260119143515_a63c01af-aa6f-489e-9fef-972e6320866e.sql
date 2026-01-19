-- Table pour l'historique des modifications produits
CREATE TABLE public.product_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type text NOT NULL, -- 'parfum', 'cosmetique', 'arome'
  product_code text NOT NULL,
  action text NOT NULL, -- 'create', 'update', 'delete'
  changes jsonb, -- Détails des champs modifiés
  user_id uuid,
  user_email text,
  created_at timestamptz DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX idx_product_history_code ON product_history(product_type, product_code);
CREATE INDEX idx_product_history_date ON product_history(created_at DESC);

-- RLS : admins peuvent voir et insérer
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read history"
  ON product_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert history"
  ON product_history FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));