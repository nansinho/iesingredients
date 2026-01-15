-- Permettre aux admins de lire toutes les demandes
CREATE POLICY "Admins can read all requests" ON public.sample_requests
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permettre aux admins de modifier les demandes (statut, etc.)
CREATE POLICY "Admins can update requests" ON public.sample_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permettre aux admins de lire tous les items
CREATE POLICY "Admins can read all request items" ON public.sample_request_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sample_requests sr
      WHERE sr.id = sample_request_items.request_id
    ) AND public.has_role(auth.uid(), 'admin')
  );

-- Ajouter les colonnes contact pour les utilisateurs non connectés
ALTER TABLE public.sample_requests 
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Rendre user_id nullable pour permettre les demandes anonymes
ALTER TABLE public.sample_requests ALTER COLUMN user_id DROP NOT NULL;

-- Politique pour permettre les demandes anonymes (insert public)
CREATE POLICY "Anyone can create requests" ON public.sample_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Politique pour permettre l'insertion d'items liés à une demande existante
CREATE POLICY "Anyone can insert request items" ON public.sample_request_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);