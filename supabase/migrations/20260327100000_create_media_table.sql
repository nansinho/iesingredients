-- Media library table for centralized asset management
CREATE TABLE IF NOT EXISTS public.media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER, -- bytes
  file_type TEXT, -- mime type
  width INTEGER,
  height INTEGER,
  alt_text TEXT DEFAULT '',
  description TEXT DEFAULT '',
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for folder browsing and search
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media(folder);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);

-- RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read
CREATE POLICY "Authenticated users can view media"
  ON public.media FOR SELECT
  TO authenticated
  USING (true);

-- Admins can manage
CREATE POLICY "Admins can insert media"
  ON public.media FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media"
  ON public.media FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media"
  ON public.media FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update trigger
CREATE TRIGGER set_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add meta_title and meta_description to blog_articles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE public.blog_articles ADD COLUMN meta_title TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE public.blog_articles ADD COLUMN meta_description TEXT DEFAULT '';
  END IF;
END $$;
