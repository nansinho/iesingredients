-- ============================================================
-- IES Ingredients - Schema SQL complet pour Supabase
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. TABLE: profiles (liée à auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger auto-création du profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, company)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. TABLE: user_roles (RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- 4. TABLE: cosmetique_fr (Cosmétiques)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cosmetique_fr (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE,
  nom_commercial TEXT,
  inci TEXT,
  cas_no TEXT,
  gamme TEXT,
  origine TEXT,
  description TEXT,
  benefices TEXT,
  benefices_aqueux TEXT,
  benefices_huileux TEXT,
  application TEXT,
  solubilite TEXT,
  aspect TEXT,
  certifications TEXT,
  conservateurs TEXT,
  type_de_peau TEXT,
  partie_utilisee TEXT,
  flavouring_preparation TEXT,
  calendrier_des_recoltes TEXT,
  tracabilite TEXT,
  valorisations TEXT,
  statut TEXT DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'INACTIF', 'SUPPRIME')),
  image_url TEXT,
  food_grade TEXT,
  typography_de_produit TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cosmetique_fr_code ON public.cosmetique_fr(code);
CREATE INDEX IF NOT EXISTS idx_cosmetique_fr_statut ON public.cosmetique_fr(statut);
CREATE INDEX IF NOT EXISTS idx_cosmetique_fr_nom ON public.cosmetique_fr(nom_commercial);

-- ============================================================
-- 5. TABLE: parfum_fr (Parfums)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.parfum_fr (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE,
  nom_commercial TEXT,
  nom_latin TEXT,
  inci TEXT,
  cas_no TEXT,
  base TEXT,
  aspect TEXT,
  odeur TEXT,
  profil_olfactif TEXT,
  famille_olfactive TEXT,
  origin TEXT,
  description TEXT,
  application TEXT,
  certifications TEXT,
  conservateurs TEXT,
  flavouring_preparation TEXT,
  food_grade TEXT,
  calendrier_des_recoltes TEXT,
  tracabilite TEXT,
  valorisations TEXT,
  statut TEXT DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'INACTIF', 'SUPPRIME')),
  image_url TEXT,
  "Typography_de_produit" TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parfum_fr_code ON public.parfum_fr(code);
CREATE INDEX IF NOT EXISTS idx_parfum_fr_statut ON public.parfum_fr(statut);
CREATE INDEX IF NOT EXISTS idx_parfum_fr_nom ON public.parfum_fr(nom_commercial);

-- ============================================================
-- 6. TABLE: aromes_fr (Arômes alimentaires)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aromes_fr (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE,
  nom_commercial TEXT,
  inci TEXT,
  cas_no TEXT,
  base TEXT,
  aspect TEXT,
  dosage TEXT,
  profil_aromatique TEXT,
  origin TEXT,
  description TEXT,
  application TEXT,
  certifications TEXT,
  conservateurs TEXT,
  flavouring_preparation TEXT,
  food_grade TEXT,
  gamme TEXT,
  calendrier_des_recoltes TEXT,
  tracabilite TEXT,
  valorisations TEXT,
  statut TEXT DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'INACTIF', 'SUPPRIME')),
  image_url TEXT,
  typography_de_produit TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aromes_fr_code ON public.aromes_fr(code);
CREATE INDEX IF NOT EXISTS idx_aromes_fr_statut ON public.aromes_fr(statut);
CREATE INDEX IF NOT EXISTS idx_aromes_fr_nom ON public.aromes_fr(nom_commercial);

-- ============================================================
-- 7. TABLE: parfum_performance (données de performance parfums)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.parfum_performance (
  id BIGSERIAL PRIMARY KEY,
  product_code TEXT NOT NULL,
  ordre INTEGER DEFAULT 0,
  option_name TEXT,
  performance_value TEXT,
  performance_rating NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parfum_performance_code ON public.parfum_performance(product_code);

-- ============================================================
-- 8. TABLE: parfum_stabilite (données de stabilité parfums)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.parfum_stabilite (
  id BIGSERIAL PRIMARY KEY,
  product_code TEXT NOT NULL,
  ordre INTEGER DEFAULT 0,
  base_name TEXT NOT NULL,
  ph_value TEXT,
  odeur_rating NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parfum_stabilite_code ON public.parfum_stabilite(product_code);

-- ============================================================
-- 9. TABLE: blog_articles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_fr TEXT NOT NULL,
  title_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  excerpt_fr TEXT,
  excerpt_en TEXT,
  content_fr TEXT,
  content_en TEXT,
  category TEXT DEFAULT 'news' CHECK (category IN ('news', 'events', 'certifications', 'trends')),
  author_name TEXT,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON public.blog_articles(published);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON public.blog_articles(category);

-- ============================================================
-- 10. TABLE: team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role_fr TEXT NOT NULL,
  role_en TEXT,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  bio_fr TEXT,
  bio_en TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_order ON public.team_members(display_order);

-- ============================================================
-- 11. TABLE: contact_submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions(created_at DESC);

-- ============================================================
-- 12. TABLE: sample_requests (demandes d'échantillons)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sample_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sample_requests_user ON public.sample_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_sample_requests_status ON public.sample_requests(status);
CREATE INDEX IF NOT EXISTS idx_sample_requests_created ON public.sample_requests(created_at DESC);

-- ============================================================
-- 13. TABLE: sample_request_items (produits dans une demande)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sample_request_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.sample_requests(id) ON DELETE CASCADE,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT CHECK (product_category IN ('cosmetique', 'parfum', 'arome')),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sample_request_items_request ON public.sample_request_items(request_id);

-- ============================================================
-- 14. TABLE: product_history (audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_code TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('cosmetique', 'parfum', 'arome')),
  action TEXT NOT NULL,
  changes JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_history_code ON public.product_history(product_code);
CREATE INDEX IF NOT EXISTS idx_product_history_created ON public.product_history(created_at DESC);

-- ============================================================
-- 15. TRIGGER: updated_at automatique
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables avec updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles', 'cosmetique_fr', 'parfum_fr', 'aromes_fr',
      'parfum_performance', 'parfum_stabilite', 'blog_articles',
      'team_members', 'contact_submissions', 'sample_requests'
    ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON public.%I; CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 16. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosmetique_fr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parfum_fr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aromes_fr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parfum_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parfum_stabilite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_history ENABLE ROW LEVEL SECURITY;

-- ── Fonction helper : vérifier si l'utilisateur est admin ──
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ──
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- ── USER_ROLES ──
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin());

-- ── PRODUITS (cosmetique_fr, parfum_fr, aromes_fr) : lecture publique ──
CREATE POLICY "Public read for cosmetique_fr"
  ON public.cosmetique_fr FOR SELECT
  USING (true);

CREATE POLICY "Admin write for cosmetique_fr"
  ON public.cosmetique_fr FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public read for parfum_fr"
  ON public.parfum_fr FOR SELECT
  USING (true);

CREATE POLICY "Admin write for parfum_fr"
  ON public.parfum_fr FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public read for aromes_fr"
  ON public.aromes_fr FOR SELECT
  USING (true);

CREATE POLICY "Admin write for aromes_fr"
  ON public.aromes_fr FOR ALL
  USING (public.is_admin());

-- ── PARFUM PERFORMANCE & STABILITE ──
CREATE POLICY "Public read for parfum_performance"
  ON public.parfum_performance FOR SELECT
  USING (true);

CREATE POLICY "Admin write for parfum_performance"
  ON public.parfum_performance FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public read for parfum_stabilite"
  ON public.parfum_stabilite FOR SELECT
  USING (true);

CREATE POLICY "Admin write for parfum_stabilite"
  ON public.parfum_stabilite FOR ALL
  USING (public.is_admin());

-- ── BLOG ARTICLES ──
CREATE POLICY "Public read published articles"
  ON public.blog_articles FOR SELECT
  USING (published = true);

CREATE POLICY "Admin full access to articles"
  ON public.blog_articles FOR ALL
  USING (public.is_admin());

-- ── TEAM MEMBERS ──
CREATE POLICY "Public read for team_members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Admin write for team_members"
  ON public.team_members FOR ALL
  USING (public.is_admin());

-- ── CONTACT SUBMISSIONS ──
CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin read/update for contact_submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin update for contact_submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete for contact_submissions"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin());

-- ── SAMPLE REQUESTS ──
CREATE POLICY "Anyone can insert sample requests"
  ON public.sample_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own requests"
  ON public.sample_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin full access to sample_requests"
  ON public.sample_requests FOR ALL
  USING (public.is_admin());

-- ── SAMPLE REQUEST ITEMS ──
CREATE POLICY "Anyone can insert sample_request_items"
  ON public.sample_request_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own request items"
  ON public.sample_request_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sample_requests sr
      WHERE sr.id = request_id AND sr.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin full access to sample_request_items"
  ON public.sample_request_items FOR ALL
  USING (public.is_admin());

-- ── PRODUCT HISTORY ──
CREATE POLICY "Admin read for product_history"
  ON public.product_history FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin insert for product_history"
  ON public.product_history FOR INSERT
  WITH CHECK (public.is_admin());

-- ============================================================
-- 17. PREMIER ADMIN (à exécuter APRÈS inscription du premier user)
-- Remplacer <USER_UUID> par l'UUID du premier utilisateur
-- ============================================================
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('<USER_UUID>', 'admin');

-- ============================================================
-- FIN DU SCHEMA
-- ============================================================
