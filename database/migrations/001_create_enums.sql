-- Migration 001: Criar Enums e Tipos Customizados
-- Portal de Eventos Garanhuns
-- Data: 2025-01-26

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

-- Comentário de conclusão
COMMENT ON TYPE user_type_enum IS 'Tipos de usuário do sistema';
COMMENT ON TYPE user_status_enum IS 'Status dos usuários';
COMMENT ON TYPE event_type_enum IS 'Tipos de eventos disponíveis';
COMMENT ON TYPE event_status_enum IS 'Status dos eventos';
COMMENT ON TYPE media_type_enum IS 'Tipos de mídia suportados';
COMMENT ON TYPE media_status_enum IS 'Status de aprovação das mídias';
COMMENT ON TYPE article_status_enum IS 'Status dos artigos/notícias';
COMMENT ON TYPE comment_status_enum IS 'Status dos comentários';
COMMENT ON TYPE interaction_type_enum IS 'Tipos de interação dos usuários com eventos';
COMMENT ON TYPE notification_type_enum IS 'Tipos de notificações do sistema'; 