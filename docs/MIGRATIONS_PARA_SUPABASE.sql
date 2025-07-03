-- =====================================================
-- MIGRATIONS COMPLETAS - PORTAL DE EVENTOS GARANHUNS
-- =====================================================
-- Para executar no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/sxfybutceyadvuasoerp/sql
-- 
-- INSTRUÇÕES:
-- 1. Copie e cole cada seção separadamente
-- 2. Execute uma seção por vez
-- 3. Aguarde a confirmação antes de prosseguir
-- =====================================================

-- =====================================
-- MIGRATION 001: CRIAR ENUMS
-- =====================================

-- Tipos de usuário
CREATE TYPE user_type_enum AS ENUM (
    'master', 
    'event_admin', 
    'news_editor', 
    'event_creator', 
    'end_user'
);

-- Status de usuário
CREATE TYPE user_status_enum AS ENUM (
    'active', 
    'inactive', 
    'pending_approval', 
    'suspended', 
    'banned'
);

-- Tipos de evento
CREATE TYPE event_type_enum AS ENUM (
    'musical', 'cultural', 'religious', 'sports', 'gastronomic', 
    'business', 'educational', 'social', 'artistic', 'festival',
    'conference', 'workshop', 'exhibition', 'competition'
);

-- Status de evento
CREATE TYPE event_status_enum AS ENUM (
    'draft', 'pending_approval', 'approved', 'published', 
    'cancelled', 'postponed', 'completed', 'rejected'
);

-- Tipos de mídia
CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'audio', 'document');

-- Status de mídia
CREATE TYPE media_status_enum AS ENUM ('pending_approval', 'approved', 'rejected', 'flagged');

-- Status de artigo
CREATE TYPE article_status_enum AS ENUM (
    'draft', 'review', 'approved', 'published', 
    'scheduled', 'archived', 'deleted'
);

-- Status de comentário
CREATE TYPE comment_status_enum AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- Tipos de interação
CREATE TYPE interaction_type_enum AS ENUM (
    'interested', 'going', 'maybe', 'not_going', 'favorite', 'shared'
);

-- Tipos de notificação
CREATE TYPE notification_type_enum AS ENUM (
    'event_reminder', 'event_update', 'event_cancelled', 'new_event_nearby',
    'media_approved', 'media_rejected', 'comment_reply', 'like_received',
    'article_published', 'system_update', 'welcome', 'account_verification'
);

-- =====================================
-- MIGRATION 002: CATEGORIAS DE EVENTOS
-- =====================================

CREATE TABLE event_categories (
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

-- Dados iniciais das categorias
INSERT INTO event_categories (name, slug, description, icon, color) VALUES
('Musical', 'musical', 'Shows, apresentações musicais e festivais', 'music', '#FF6B35'),
('Religioso', 'religioso', 'Eventos religiosos, missas e celebrações', 'church', '#4ECDC4'),
('Cultural', 'cultural', 'Eventos culturais, teatro e arte', 'palette', '#45B7D1'),
('Gastronômico', 'gastronomico', 'Festivais gastronômicos e eventos culinários', 'chef-hat', '#96CEB4'),
('Esportivo', 'esportivo', 'Competições e eventos esportivos', 'trophy', '#FFEAA7'),
('Gospel', 'gospel', 'Eventos e shows gospel', 'heart', '#DDA0DD'),
('Forró', 'forro', 'Eventos de forró e música regional', 'guitar', '#FFB347'),
('Natalino', 'natalino', 'Eventos natalinos e de fim de ano', 'gift', '#FF6B6B');

-- =====================================
-- MIGRATION 003: PERFIS DE USUÁRIOS
-- =====================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    user_type user_type_enum NOT NULL DEFAULT 'end_user',
    status user_status_enum NOT NULL DEFAULT 'active',
    
    -- Redes sociais
    instagram_handle VARCHAR(50),
    facebook_handle VARCHAR(50),
    whatsapp VARCHAR(20),
    
    -- Dados empresariais (para event_creator)
    organization_name VARCHAR(100),
    organization_type VARCHAR(50),
    cnpj VARCHAR(18),
    address JSONB,
    
    -- Configurações
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT FALSE
);

-- Índices importantes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);

-- =====================================
-- MIGRATION 004: EVENTOS
-- =====================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    event_type event_type_enum NOT NULL,
    category_id UUID REFERENCES event_categories(id),
    created_by UUID REFERENCES user_profiles(id) NOT NULL,
    approved_by UUID REFERENCES user_profiles(id),
    status event_status_enum NOT NULL DEFAULT 'draft',
    
    -- Flags importantes
    is_featured BOOLEAN DEFAULT FALSE,
    is_official BOOLEAN DEFAULT FALSE,
    fixado BOOLEAN DEFAULT FALSE,
    
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
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_events_official ON events(is_official);
CREATE INDEX idx_events_fixado ON events(fixado);

-- =====================================
-- MIGRATION 005: NOTÍCIAS/ARTIGOS
-- =====================================

CREATE TABLE event_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    subtitle VARCHAR(500),
    content TEXT NOT NULL,
    excerpt VARCHAR(1000),
    
    -- Autor e editor
    author_id UUID REFERENCES user_profiles(id) NOT NULL,
    editor_id UUID REFERENCES user_profiles(id),
    
    -- Status de publicação
    status article_status_enum NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_breaking_news BOOLEAN DEFAULT FALSE,
    
    -- Mídia
    featured_image TEXT,
    featured_image_caption TEXT,
    gallery_images TEXT[],
    
    -- Relacionamentos
    related_events UUID[],
    tags TEXT[],
    category VARCHAR(100),
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    keywords TEXT[],
    
    -- Engajamento
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Datas
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Índices para event_news
CREATE INDEX idx_event_news_status ON event_news(status);
CREATE INDEX idx_event_news_author_id ON event_news(author_id);
CREATE INDEX idx_event_news_published_at ON event_news(published_at);
CREATE INDEX idx_event_news_featured ON event_news(is_featured);

-- =====================================
-- CONFIGURAÇÕES DE RLS (ROW LEVEL SECURITY)
-- =====================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para leitura pública
CREATE POLICY "Allow public read access on event_categories" ON event_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access on published news" ON event_news FOR SELECT USING (status = 'published');

-- =====================================
-- COMENTÁRIO FINAL
-- =====================================

-- Schema criado com sucesso!
-- Total de tabelas: 4 principais + enums
-- Total de índices: 15+
-- RLS configurado para segurança básica

SELECT 'SUCESSO! Schema do Portal de Eventos Garanhuns criado!' as resultado; 