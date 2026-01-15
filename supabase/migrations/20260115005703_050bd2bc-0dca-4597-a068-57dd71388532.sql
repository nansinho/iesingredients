-- Créer la fonction update_updated_at_column d'abord
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Table des demandes d'échantillons
CREATE TABLE public.sample_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    company TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des items de chaque demande
CREATE TABLE public.sample_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.sample_requests(id) ON DELETE CASCADE NOT NULL,
    product_code TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_category TEXT,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.sample_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_request_items ENABLE ROW LEVEL SECURITY;

-- Policies pour sample_requests
CREATE POLICY "Users can read own requests" ON public.sample_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON public.sample_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policies pour sample_request_items
CREATE POLICY "Users can read own request items" ON public.sample_request_items
  FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.sample_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own request items" ON public.sample_request_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sample_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

-- Trigger pour updated_at
CREATE TRIGGER update_sample_requests_updated_at
  BEFORE UPDATE ON public.sample_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();