-- Tabla para contenido rico (Editor.js)
CREATE TABLE IF NOT EXISTS public.rich_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{"time":0,"blocks":[]}'::jsonb,
  isPublished BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rich_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published rich pages" ON public.rich_pages
  FOR SELECT USING (isPublished = true);

CREATE POLICY "Admins can manage rich pages" ON public.rich_pages
  FOR ALL USING (true);

CREATE INDEX idx_rich_pages_slug ON public.rich_pages(slug);