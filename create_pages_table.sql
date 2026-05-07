-- Tabla para páginas dinámicas del page builder
CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  blocks JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para páginas públicas
CREATE POLICY "Public can view published pages" ON public.pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage pages" ON public.pages
  FOR ALL USING (true);

-- Índices
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_published ON public.pages(is_published) WHERE is_published = true;