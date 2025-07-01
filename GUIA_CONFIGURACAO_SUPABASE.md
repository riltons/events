# 🚀 Guia de Configuração - Supabase Remoto
## Portal de Eventos Garanhuns

### ✅ STATUS ATUAL
- **Conexão**: ✅ Estabelecida com sucesso
- **URL**: `https://sxfybutceyadvuasoerp.supabase.co`
- **Projeto ID**: `sxfybutceyadvuasoerp`
- **API REST**: ✅ Funcionando
- **Execução DDL**: ⚠️ Apenas via painel web (plano gratuito)

---

## 📋 PASSO 1: Executar Migrations no SQL Editor

### 🌐 1.1 Acessar o SQL Editor
1. Abra o navegador
2. Acesse: https://supabase.com/dashboard/project/sxfybutceyadvuasoerp/sql
3. Faça login com sua conta Supabase

### 📝 1.2 Executar Migrations em Ordem

**IMPORTANTE**: Execute cada seção separadamente, aguardando a confirmação antes de prosseguir!

#### ⭐ SEÇÃO 1: Enums (Copie e cole isto)
```sql
-- MIGRATION 001: CRIAR ENUMS
CREATE TYPE user_type_enum AS ENUM (
    'master', 'event_admin', 'news_editor', 'event_creator', 'end_user'
);
CREATE TYPE user_status_enum AS ENUM (
    'active', 'inactive', 'pending_approval', 'suspended', 'banned'
);
CREATE TYPE event_type_enum AS ENUM (
    'musical', 'cultural', 'religious', 'sports', 'gastronomic', 
    'business', 'educational', 'social', 'artistic', 'festival',
    'conference', 'workshop', 'exhibition', 'competition'
);
CREATE TYPE event_status_enum AS ENUM (
    'draft', 'pending_approval', 'approved', 'published', 
    'cancelled', 'postponed', 'completed', 'rejected'
);
CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'audio', 'document');
CREATE TYPE media_status_enum AS ENUM ('pending_approval', 'approved', 'rejected', 'flagged');
CREATE TYPE article_status_enum AS ENUM (
    'draft', 'review', 'approved', 'published', 'scheduled', 'archived', 'deleted'
);
CREATE TYPE comment_status_enum AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE interaction_type_enum AS ENUM (
    'interested', 'going', 'maybe', 'not_going', 'favorite', 'shared'
);
CREATE TYPE notification_type_enum AS ENUM (
    'event_reminder', 'event_update', 'event_cancelled', 'new_event_nearby',
    'media_approved', 'media_rejected', 'comment_reply', 'like_received',
    'article_published', 'system_update', 'welcome', 'account_verification'
);
```

#### ⭐ SEÇÃO 2: Categorias (Aguarde SEÇÃO 1 completar, depois cole isto)
```sql
-- MIGRATION 002: CATEGORIAS DE EVENTOS
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

INSERT INTO event_categories (name, slug, description, icon, color) VALUES
('Musical', 'musical', 'Shows, apresentações musicais e festivais', 'music', '#FF6B35'),
('Religioso', 'religioso', 'Eventos religiosos, missas e celebrações', 'church', '#4ECDC4'),
('Cultural', 'cultural', 'Eventos culturais, teatro e arte', 'palette', '#45B7D1'),
('Gastronômico', 'gastronomico', 'Festivais gastronômicos e eventos culinários', 'chef-hat', '#96CEB4'),
('Esportivo', 'esportivo', 'Competições e eventos esportivos', 'trophy', '#FFEAA7'),
('Gospel', 'gospel', 'Eventos e shows gospel', 'heart', '#DDA0DD'),
('Forró', 'forro', 'Eventos de forró e música regional', 'guitar', '#FFB347'),
('Natalino', 'natalino', 'Eventos natalinos e de fim de ano', 'gift', '#FF6B6B');
```

#### ⭐ SEÇÃO 3: Usuários (Aguarde SEÇÃO 2, depois cole isto)
```sql
-- MIGRATION 003: PERFIS DE USUÁRIOS
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
    instagram_handle VARCHAR(50),
    facebook_handle VARCHAR(50),
    whatsapp VARCHAR(20),
    organization_name VARCHAR(100),
    organization_type VARCHAR(50),
    cnpj VARCHAR(18),
    address JSONB,
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
```

#### ⭐ SEÇÃO 4: Eventos (Aguarde SEÇÃO 3, depois cole isto)
```sql
-- MIGRATION 004: EVENTOS
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
    is_featured BOOLEAN DEFAULT FALSE,
    is_official BOOLEAN DEFAULT FALSE,
    fixado BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/Recife',
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    venue_name VARCHAR(200),
    address JSONB,
    location_coordinates POINT,
    location_instructions TEXT,
    banner_image TEXT,
    gallery_images TEXT[],
    promotional_video TEXT,
    capacity INTEGER,
    min_age INTEGER,
    max_age INTEGER,
    accessibility_info JSONB,
    dress_code VARCHAR(100),
    is_free BOOLEAN DEFAULT TRUE,
    ticket_info JSONB,
    contact_info JSONB,
    social_links JSONB,
    external_links JSONB,
    organizer_info JSONB,
    sponsors JSONB[],
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    tags TEXT[],
    keywords TEXT[],
    allow_media_upload BOOLEAN DEFAULT TRUE,
    require_approval_for_media BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    allow_reviews BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    interested_count INTEGER DEFAULT 0,
    going_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_events_official ON events(is_official);
CREATE INDEX idx_events_fixado ON events(fixado);
```

#### ⭐ SEÇÃO 5: Notícias (Aguarde SEÇÃO 4, depois cole isto)
```sql
-- MIGRATION 005: NOTÍCIAS/ARTIGOS
CREATE TABLE event_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    subtitle VARCHAR(500),
    content TEXT NOT NULL,
    excerpt VARCHAR(1000),
    author_id UUID REFERENCES user_profiles(id) NOT NULL,
    editor_id UUID REFERENCES user_profiles(id),
    status article_status_enum NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_breaking_news BOOLEAN DEFAULT FALSE,
    featured_image TEXT,
    featured_image_caption TEXT,
    gallery_images TEXT[],
    related_events UUID[],
    tags TEXT[],
    category VARCHAR(100),
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    keywords TEXT[],
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_event_news_status ON event_news(status);
CREATE INDEX idx_event_news_author_id ON event_news(author_id);
CREATE INDEX idx_event_news_published_at ON event_news(published_at);
CREATE INDEX idx_event_news_featured ON event_news(is_featured);
```

#### ⭐ SEÇÃO 6: Segurança RLS (Aguarde SEÇÃO 5, depois cole isto)
```sql
-- CONFIGURAÇÕES DE RLS (ROW LEVEL SECURITY)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on event_categories" ON event_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access on published news" ON event_news FOR SELECT USING (status = 'published');

SELECT 'SUCESSO! Schema do Portal de Eventos Garanhuns criado!' as resultado;
```

---

## 🔧 PASSO 2: Configurar Frontend

### 2.1 Atualizar configuração do Supabase no frontend

Execute este comando no terminal do projeto:

```bash
npm install @supabase/supabase-js
```

### 2.2 Criar arquivo de configuração

O arquivo já foi criado! Use o `supabase-config.js` com as credenciais corretas.

### 2.3 Atualizar src/lib/database.js

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxfybutceyadvuasoerp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDgwMDgsImV4cCI6MjA2Njc4NDAwOH0.OqTIfBrK1qvKQX1PoUOrYIhgRaGNMhq5Z6TM-LgSs50'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🧪 PASSO 3: Testar Conexão

Após executar todas as migrations, execute este comando para testar:

```bash
node supabase-final-config.js
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Executar Migrations** (Seguir PASSO 1)
2. ✅ **Configurar Frontend** (PASSO 2)
3. ✅ **Testar Conexão** (PASSO 3)
4. 🚀 **Popular Dados Iniciais**
5. 🎨 **Atualizar Interface**
6. 📱 **Testar Funcionalidades**

---

## 📞 SUPORTE

Se encontrar algum erro:

1. **Erro de Tipo/Enum**: Certifique-se que executou a SEÇÃO 1 primeiro
2. **Erro de Referência**: Execute as seções em ordem
3. **Erro de Permissão**: Verifique se está logado no Supabase
4. **Erro de Sintaxe**: Copie exatamente como mostrado

**Status**: ✅ Supabase conectado e pronto para uso! 