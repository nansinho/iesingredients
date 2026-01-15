-- ================================================
-- Table: blog_articles (Articles de blog)
-- ================================================
CREATE TABLE public.blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt_fr TEXT,
  excerpt_en TEXT,
  content_fr TEXT,
  content_en TEXT,
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'news',
  author_name TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS pour blog_articles
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles" 
ON public.blog_articles FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can manage all articles" 
ON public.blog_articles FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
CREATE TRIGGER update_blog_articles_updated_at
BEFORE UPDATE ON public.blog_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- Table: contact_submissions (Messages de contact)
-- ================================================
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS pour contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" 
ON public.contact_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage contacts" 
ON public.contact_submissions FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- Table: team_members (Membres de l'équipe)
-- ================================================
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_fr TEXT NOT NULL,
  role_en TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  photo_url TEXT,
  bio_fr TEXT,
  bio_en TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS pour team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active members" 
ON public.team_members FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage team" 
ON public.team_members FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- Insérer quelques données initiales
-- ================================================

-- Articles de blog initiaux
INSERT INTO public.blog_articles (title_fr, title_en, slug, excerpt_fr, excerpt_en, category, author_name, published, published_at) VALUES
('Lancement nouvelle gamme botaniques', 'New botanical range launch', 'lancement-nouvelle-gamme-botaniques', 'Découvrez notre nouvelle gamme d''ingrédients botaniques innovants pour la cosmétique naturelle.', 'Discover our new range of innovative botanical ingredients for natural cosmetics.', 'news', 'IES Ingredients', true, '2024-12-15'),
('IES au salon In-Cosmetics 2024', 'IES at In-Cosmetics 2024', 'ies-in-cosmetics-2024', 'Retrouvez-nous au salon In-Cosmetics Global 2024 pour découvrir nos dernières innovations.', 'Meet us at In-Cosmetics Global 2024 to discover our latest innovations.', 'events', 'IES Ingredients', true, '2024-11-28'),
('Certification COSMOS pour 50 références', 'COSMOS certification for 50 references', 'certification-cosmos-50-references', '50 de nos ingrédients viennent d''obtenir la certification COSMOS, gage de qualité et de naturalité.', '50 of our ingredients have just obtained COSMOS certification, a guarantee of quality and naturalness.', 'certifications', 'IES Ingredients', true, '2024-11-10'),
('Tendances 2025', '2025 Trends', 'tendances-2025', 'Découvrez les grandes tendances qui façonneront l''industrie cosmétique en 2025.', 'Discover the major trends that will shape the cosmetics industry in 2025.', 'trends', 'IES Ingredients', true, '2024-10-25');

-- Membres de l'équipe initiaux
INSERT INTO public.team_members (name, role_fr, role_en, email, display_order, is_active) VALUES
('Sophie Martin', 'Directrice Générale', 'General Director', 'sophie.martin@ies-ingredients.com', 1, true),
('Pierre Dubois', 'Directeur Commercial', 'Commercial Director', 'pierre.dubois@ies-ingredients.com', 2, true),
('Marie Laurent', 'Responsable R&D', 'R&D Manager', 'marie.laurent@ies-ingredients.com', 3, true),
('Jean Moreau', 'Responsable Qualité', 'Quality Manager', 'jean.moreau@ies-ingredients.com', 4, true);