-- Migration 002: Criar Tabela de Categorias de Eventos
-- Portal de Eventos Garanhuns
-- Data: 2025-01-26

CREATE TABLE public.event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES event_categories(id),
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura para todos
CREATE POLICY "Anyone can view active categories" ON public.event_categories 
FOR SELECT USING (is_active = true);

-- Criar política para permitir administradores gerenciarem categorias
CREATE POLICY "Admins can manage categories" ON public.event_categories 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('master', 'event_admin')
    )
);

-- Índices para performance
CREATE INDEX idx_event_categories_slug ON event_categories(slug);
CREATE INDEX idx_event_categories_parent_id ON event_categories(parent_id);
CREATE INDEX idx_event_categories_active ON event_categories(is_active);
CREATE INDEX idx_event_categories_sort_order ON event_categories(sort_order);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_categories_updated_at 
    BEFORE UPDATE ON event_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE event_categories IS 'Categorias hierárquicas para classificação dos eventos';
COMMENT ON COLUMN event_categories.slug IS 'Identificador único amigável para URLs';
COMMENT ON COLUMN event_categories.parent_id IS 'Referência para categoria pai (hierarquia)';
COMMENT ON COLUMN event_categories.icon IS 'Nome do ícone (ex: music, calendar, etc)';
COMMENT ON COLUMN event_categories.color IS 'Cor hexadecimal para identificação visual';
COMMENT ON COLUMN event_categories.sort_order IS 'Ordem de exibição das categorias'; 