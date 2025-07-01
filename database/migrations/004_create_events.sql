-- Migration 004: Criar Tabela de Eventos
-- Portal de Eventos Garanhuns
-- Data: 2025-01-26

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    event_type event_type_enum NOT NULL,
    category_id UUID REFERENCES event_categories(id),
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    status event_status_enum NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_official BOOLEAN DEFAULT FALSE,
    
    -- Datas e horários
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/Recife',
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    
    -- Localização
    venue_name VARCHAR(200),
    address JSONB,
    location_coordinates POINT,
    location_instructions TEXT,
    
    -- Mídia e visual
    banner_image TEXT,
    gallery_images TEXT[],
    promotional_video TEXT,
    
    -- Informações do evento
    capacity INTEGER,
    min_age INTEGER,
    max_age INTEGER,
    accessibility_info JSONB,
    dress_code VARCHAR(100),
    
    -- Preços e ingressos
    is_free BOOLEAN DEFAULT TRUE,
    ticket_info JSONB,
    
    -- Contato e links
    contact_info JSONB,
    social_links JSONB,
    external_links JSONB,
    
    -- Organização
    organizer_info JSONB,
    sponsors JSONB[],
    
    -- SEO e metadata
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    tags TEXT[],
    keywords TEXT[],
    
    -- Configurações
    allow_media_upload BOOLEAN DEFAULT TRUE,
    require_approval_for_media BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    allow_reviews BOOLEAN DEFAULT TRUE,
    
    -- Estatísticas
    view_count INTEGER DEFAULT 0,
    interested_count INTEGER DEFAULT 0,
    going_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT events_start_before_end CHECK (start_date < end_date),
    CONSTRAINT events_registration_valid CHECK (
        registration_start IS NULL OR registration_end IS NULL OR 
        registration_start <= registration_end
    ),
    CONSTRAINT events_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT events_age_valid CHECK (
        (min_age IS NULL OR min_age >= 0) AND 
        (max_age IS NULL OR max_age >= 0) AND
        (min_age IS NULL OR max_age IS NULL OR min_age <= max_age)
    )
);

-- Habilitar RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Todos podem ver eventos publicados
CREATE POLICY "Anyone can view published events" ON public.events 
FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Criadores podem ver próprios eventos
CREATE POLICY "Users can view own events" ON public.events 
FOR SELECT USING (created_by = auth.uid());

-- Admins podem ver todos os eventos
CREATE POLICY "Admins can view all events" ON public.events 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('master', 'event_admin')
    )
);

-- Usuários autenticados podem criar eventos
CREATE POLICY "Authenticated users can create events" ON public.events 
FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    created_by = auth.uid()
);

-- Criadores podem editar próprios eventos (se não publicados)
CREATE POLICY "Users can edit own unpublished events" ON public.events 
FOR UPDATE USING (
    created_by = auth.uid() AND
    status IN ('draft', 'pending_approval')
);

-- Admins podem editar qualquer evento
CREATE POLICY "Admins can edit any event" ON public.events 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('master', 'event_admin')
    )
);

-- Apenas criadores podem deletar próprios eventos não publicados (soft delete)
CREATE POLICY "Users can delete own unpublished events" ON public.events 
FOR UPDATE USING (
    created_by = auth.uid() AND
    status IN ('draft', 'pending_approval') AND
    deleted_at IS NULL
);

-- Índices para performance
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_end_date ON events(end_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_is_featured ON events(is_featured);
CREATE INDEX idx_events_is_official ON events(is_official);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_deleted_at ON events(deleted_at);
CREATE INDEX idx_events_published_at ON events(published_at);

-- Índice geoespacial para localização
CREATE INDEX idx_events_location ON events USING GIST(location_coordinates);

-- Índice para busca textual
CREATE INDEX idx_events_search ON events USING gin(
    to_tsvector('portuguese', 
        COALESCE(title, '') || ' ' || 
        COALESCE(description, '') || ' ' || 
        COALESCE(short_description, '') || ' ' ||
        COALESCE(venue_name, '') || ' ' ||
        array_to_string(COALESCE(tags, ARRAY[]::text[]), ' ')
    )
);

-- Índice composto para eventos ativos por data
CREATE INDEX idx_events_active_by_date ON events(status, start_date, is_featured) 
WHERE deleted_at IS NULL;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION generate_event_slug(title_text TEXT, event_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Converter título para slug
    base_slug := lower(trim(title_text));
    base_slug := regexp_replace(base_slug, '[áàâãä]', 'a', 'g');
    base_slug := regexp_replace(base_slug, '[éèêë]', 'e', 'g');
    base_slug := regexp_replace(base_slug, '[íìîï]', 'i', 'g');
    base_slug := regexp_replace(base_slug, '[óòôõö]', 'o', 'g');
    base_slug := regexp_replace(base_slug, '[úùûü]', 'u', 'g');
    base_slug := regexp_replace(base_slug, '[ç]', 'c', 'g');
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := regexp_replace(base_slug, '^-+|-+$', '', 'g');
    
    final_slug := base_slug;
    
    -- Verificar unicidade
    WHILE EXISTS (
        SELECT 1 FROM events 
        WHERE slug = final_slug 
        AND (event_id IS NULL OR id != event_id)
    ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar slug automaticamente se não fornecido
CREATE OR REPLACE FUNCTION events_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_event_slug(NEW.title, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_generate_slug_trigger
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION events_generate_slug();

-- Função para atualizar published_at quando status muda para published
CREATE OR REPLACE FUNCTION events_update_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
        NEW.published_at := NOW();
    ELSIF NEW.status != 'published' THEN
        NEW.published_at := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_update_published_at_trigger
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION events_update_published_at();

-- Comentários
COMMENT ON TABLE events IS 'Tabela principal de eventos do portal';
COMMENT ON COLUMN events.slug IS 'Identificador único amigável para URLs';
COMMENT ON COLUMN events.event_type IS 'Tipo geral do evento (enum)';
COMMENT ON COLUMN events.category_id IS 'Categoria específica do evento';
COMMENT ON COLUMN events.is_featured IS 'Evento em destaque na página inicial';
COMMENT ON COLUMN events.is_official IS 'Evento oficial da prefeitura/governo';
COMMENT ON COLUMN events.location_coordinates IS 'Coordenadas geográficas (lat, lng)';
COMMENT ON COLUMN events.ticket_info IS 'Informações de ingressos em formato JSON';
COMMENT ON COLUMN events.contact_info IS 'Informações de contato em formato JSON';
COMMENT ON COLUMN events.organizer_info IS 'Informações do organizador em formato JSON';
COMMENT ON COLUMN events.deleted_at IS 'Data de exclusão soft delete'; 