# Planejamento Detalhado - Banco de Dados Local e Remoto Supabase

## 📋 Visão Geral

Este documento detalha o planejamento completo para criação e configuração do banco de dados PostgreSQL local e remoto no Supabase para o Portal de Eventos Garanhuns, incluindo migração, políticas de segurança e configurações específicas.

---

## 🎯 Objetivos

### **Ambiente Local**
- Configurar PostgreSQL local para desenvolvimento
- Implementar schema completo com todas as tabelas
- Configurar dados de teste e desenvolvimento
- Sincronização com ambiente remoto

### **Ambiente Remoto (Supabase)**
- Configurar projeto Supabase
- Implementar Row Level Security (RLS)
- Configurar autenticação e autorização
- Configurar políticas de acesso por tipo de usuário
- Implementar Realtime para funcionalidades sociais

---

## 🔧 Fase 1: Configuração do Ambiente Local

### **1.1 Instalação do PostgreSQL Local**

#### **No Windows:**
```powershell
# Instalar via Chocolatey
choco install postgresql

# Ou baixar diretamente do site oficial
# https://www.postgresql.org/download/windows/

# Iniciar serviço
net start postgresql-x64-15

# Conectar ao PostgreSQL
psql -U postgres
```

#### **Configuração Inicial:**
```sql
-- Criar database para o projeto
CREATE DATABASE eventos_garanhuns_dev;

-- Criar usuário específico para o projeto
CREATE USER eventos_user WITH PASSWORD 'eventos_dev_2025';

-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE eventos_garanhuns_dev TO eventos_user;
GRANT USAGE ON SCHEMA public TO eventos_user;
GRANT CREATE ON SCHEMA public TO eventos_user;
```

### **1.2 Configuração do Ambiente de Desenvolvimento**

#### **Arquivo .env para desenvolvimento:**
```env
# Banco Local
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
LOCAL_DB_NAME=eventos_garanhuns_dev
LOCAL_DB_USER=eventos_user
LOCAL_DB_PASSWORD=eventos_dev_2025
LOCAL_DB_URL=postgresql://eventos_user:eventos_dev_2025@localhost:5432/eventos_garanhuns_dev

# Supabase (será preenchido após configuração)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_KEY=sua-chave-servico
```

#### **Estrutura de Pastas:**
```
eventsApp/
├── database/
│   ├── migrations/
│   │   ├── 001_create_enums.sql
│   │   ├── 002_create_users.sql
│   │   ├── 003_create_event_categories.sql
│   │   ├── 004_create_events.sql
│   │   ├── 005_create_media.sql
│   │   ├── 006_create_news_articles.sql
│   │   ├── 007_create_comments.sql
│   │   ├── 008_create_likes.sql
│   │   ├── 009_create_interactions.sql
│   │   ├── 010_create_notifications.sql
│   │   ├── 011_create_system_tables.sql
│   │   ├── 012_create_indexes.sql
│   │   ├── 013_create_views.sql
│   │   ├── 014_create_triggers.sql
│   │   └── 015_insert_initial_data.sql
│   ├── seeds/
│   │   ├── categories.sql
│   │   ├── test_users.sql
│   │   ├── sample_events.sql
│   │   └── system_settings.sql
│   ├── policies/
│   │   ├── users_policies.sql
│   │   ├── events_policies.sql
│   │   ├── media_policies.sql
│   │   └── general_policies.sql
│   └── scripts/
│       ├── setup_local.sh
│       ├── setup_supabase.js
│       ├── migrate.js
│       └── seed.js
```

---

## 🌐 Fase 2: Configuração do Supabase

### **2.1 Criação do Projeto Supabase**

#### **Passos Iniciais:**
1. Acessar [supabase.com](https://supabase.com)
2. Criar nova conta ou fazer login
3. Criar novo projeto: "Portal Eventos Garanhuns"
4. Escolher região: "South America (São Paulo)"
5. Aguardar provisioning do projeto

#### **Configurações Iniciais:**
```javascript
// Configurar projeto via CLI
npm install -g supabase

// Login no Supabase
supabase login

// Inicializar projeto local
supabase init

// Linkar com projeto remoto
supabase link --project-ref SEU-PROJECT-REF
```

### **2.2 Configuração da Autenticação**

#### **Configurar Providers de Auth:**
```javascript
// supabase/config.toml
[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://seu-dominio.com"]

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = true

[auth.providers.google]
enabled = true
client_id = "seu-google-client-id"
secret = "seu-google-secret"

[auth.providers.facebook]
enabled = true
client_id = "seu-facebook-app-id"
secret = "seu-facebook-secret"
```

#### **Configurar Templates de Email:**
```html
<!-- supabase/templates/invite.html -->
<h2>Bem-vindo ao Portal de Eventos Garanhuns!</h2>
<p>Você foi convidado para se cadastrar no portal oficial de eventos de Garanhuns/PE.</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Cadastro</a></p>

<!-- supabase/templates/confirmation.html -->
<h2>Confirme seu email</h2>
<p>Clique no link abaixo para confirmar seu cadastro:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
```

---

## 📊 Fase 3: Criação das Migrações

### **3.1 Migration 001: Enums e Tipos**

#### **database/migrations/001_create_enums.sql:**
```sql
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
```

### **3.2 Migration 002: Tabela Users**

#### **database/migrations/002_create_users.sql:**
```sql
-- Estender tabela auth.users do Supabase
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    user_type user_type_enum NOT NULL DEFAULT 'end_user',
    status user_status_enum NOT NULL DEFAULT 'active',
    instagram_handle VARCHAR(50),
    facebook_handle VARCHAR(50),
    whatsapp VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    permissions JSONB DEFAULT '{}',
    
    -- Campos empresariais
    organization_name VARCHAR(100),
    organization_type VARCHAR(50),
    cnpj VARCHAR(18),
    address JSONB,
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    
    -- Verificações
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_completed BOOLEAN DEFAULT FALSE
);

-- Habilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### **3.3 Migration 003: Categorias de Eventos**

#### **database/migrations/003_create_event_categories.sql:**
```sql
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

-- Habilitar RLS
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

-- Índices
CREATE INDEX idx_event_categories_slug ON event_categories(slug);
CREATE INDEX idx_event_categories_parent_id ON event_categories(parent_id);
CREATE INDEX idx_event_categories_active ON event_categories(is_active);
```

### **3.4 Migration 004: Tabela Events**

#### **database/migrations/004_create_events.sql:**
```sql
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
    
    -- Mídia
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
    
    -- SEO
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
    deleted_at TIMESTAMPTZ
);

-- Habilitar RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
```

### **3.5 Migration 005: Tabela Media**

#### **database/migrations/005_create_media.sql:**
```sql
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    
    -- Informações do arquivo
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    media_type media_type_enum NOT NULL,
    
    -- Metadata
    title VARCHAR(200),
    description TEXT,
    alt_text VARCHAR(500),
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    
    -- Status
    status media_status_enum DEFAULT 'pending_approval',
    is_featured BOOLEAN DEFAULT FALSE,
    is_cover BOOLEAN DEFAULT FALSE,
    
    -- Interações
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Marcações
    tagged_users UUID[],
    tags TEXT[],
    
    -- Localização
    location_coordinates POINT,
    location_name VARCHAR(200),
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Habilitar RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Storage bucket para mídias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'event-media',
    'event-media',
    true,
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);
```

---

## 🔒 Fase 4: Políticas de Segurança (RLS)

### **4.1 Políticas para User Profiles**

#### **database/policies/users_policies.sql:**
```sql
-- Usuários podem ver perfis públicos
CREATE POLICY "Users can view public profiles" ON public.user_profiles 
FOR SELECT USING (true);

-- Usuários podem editar apenas o próprio perfil
CREATE POLICY "Users can edit own profile" ON public.user_profiles 
FOR UPDATE USING (auth.uid() = id);

-- Usuários podem inserir próprio perfil
CREATE POLICY "Users can insert own profile" ON public.user_profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

-- Apenas masters podem deletar perfis
CREATE POLICY "Only masters can delete profiles" ON public.user_profiles 
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND user_type = 'master'
    )
);
```

### **4.2 Políticas para Events**

#### **database/policies/events_policies.sql:**
```sql
-- Todos podem ver eventos publicados
CREATE POLICY "Anyone can view published events" ON public.events 
FOR SELECT USING (status = 'published');

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

-- Apenas criadores podem deletar próprios eventos não publicados
CREATE POLICY "Users can delete own unpublished events" ON public.events 
FOR DELETE USING (
    created_by = auth.uid() AND
    status IN ('draft', 'pending_approval')
);
```

### **4.3 Políticas para Media**

#### **database/policies/media_policies.sql:**
```sql
-- Todos podem ver mídias aprovadas
CREATE POLICY "Anyone can view approved media" ON public.media 
FOR SELECT USING (status = 'approved');

-- Usuários podem ver próprias mídias
CREATE POLICY "Users can view own media" ON public.media 
FOR SELECT USING (uploaded_by = auth.uid());

-- Usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload media" ON public.media 
FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    uploaded_by = auth.uid()
);

-- Usuários podem editar próprias mídias não aprovadas
CREATE POLICY "Users can edit own pending media" ON public.media 
FOR UPDATE USING (
    uploaded_by = auth.uid() AND
    status = 'pending_approval'
);

-- Admins podem aprovar mídias
CREATE POLICY "Admins can approve media" ON public.media 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('master', 'event_admin')
    )
);

-- Storage policies para bucket de mídias
CREATE POLICY "Users can upload to event-media bucket" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'event-media' AND
    auth.uid() IS NOT NULL
);

CREATE POLICY "Anyone can view media files" ON storage.objects 
FOR SELECT USING (bucket_id = 'event-media');

CREATE POLICY "Users can update own media files" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'event-media' AND
    owner = auth.uid()
);
```

---

## 🚀 Fase 5: Scripts de Automação

### **5.1 Script de Setup Local**

#### **database/scripts/setup_local.sh:**
```bash
#!/bin/bash

echo "🚀 Configurando ambiente local PostgreSQL..."

# Verificar se PostgreSQL está rodando
if ! pg_isready -h localhost -p 5432; then
    echo "❌ PostgreSQL não está rodando. Iniciando..."
    net start postgresql-x64-15
fi

# Criar database se não existir
createdb -h localhost -U postgres eventos_garanhuns_dev 2>/dev/null || echo "Database já existe"

# Executar migrações
echo "📊 Executando migrações..."
for migration in database/migrations/*.sql; do
    echo "Executando: $migration"
    psql -h localhost -U postgres -d eventos_garanhuns_dev -f "$migration"
done

# Executar seeds
echo "🌱 Executando seeds..."
for seed in database/seeds/*.sql; do
    echo "Executando: $seed"
    psql -h localhost -U postgres -d eventos_garanhuns_dev -f "$seed"
done

echo "✅ Configuração local concluída!"
```

### **5.2 Script de Setup Supabase**

#### **database/scripts/setup_supabase.js:**
```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSupabase() {
    console.log('🚀 Configurando Supabase...');
    
    try {
        // Executar migrações
        const migrationsDir = path.join(__dirname, '../migrations');
        const migrations = fs.readdirSync(migrationsDir).sort();
        
        for (const migration of migrations) {
            console.log(`📊 Executando migração: ${migration}`);
            const sql = fs.readFileSync(path.join(migrationsDir, migration), 'utf8');
            
            const { error } = await supabase.rpc('execute_sql', { query: sql });
            if (error) {
                console.error(`❌ Erro na migração ${migration}:`, error);
                throw error;
            }
        }
        
        // Executar políticas
        const policiesDir = path.join(__dirname, '../policies');
        const policies = fs.readdirSync(policiesDir);
        
        for (const policy of policies) {
            console.log(`🔒 Aplicando políticas: ${policy}`);
            const sql = fs.readFileSync(path.join(policiesDir, policy), 'utf8');
            
            const { error } = await supabase.rpc('execute_sql', { query: sql });
            if (error) {
                console.error(`❌ Erro nas políticas ${policy}:`, error);
                throw error;
            }
        }
        
        // Executar seeds
        const seedsDir = path.join(__dirname, '../seeds');
        const seeds = fs.readdirSync(seedsDir);
        
        for (const seed of seeds) {
            console.log(`🌱 Executando seed: ${seed}`);
            const sql = fs.readFileSync(path.join(seedsDir, seed), 'utf8');
            
            const { error } = await supabase.rpc('execute_sql', { query: sql });
            if (error) {
                console.error(`❌ Erro no seed ${seed}:`, error);
                throw error;
            }
        }
        
        console.log('✅ Configuração Supabase concluída!');
        
    } catch (error) {
        console.error('❌ Erro na configuração:', error);
        process.exit(1);
    }
}

setupSupabase();
```

---

## 📊 Fase 6: Dados Iniciais (Seeds)

### **6.1 Categorias de Eventos**

#### **database/seeds/categories.sql:**
```sql
-- Inserir categorias principais
INSERT INTO public.event_categories (name, slug, description, icon, color, sort_order) VALUES
('Musical', 'musical', 'Shows, apresentações musicais e festivais', 'music', '#FF6B35', 1),
('Religioso', 'religioso', 'Eventos religiosos, missas e celebrações', 'church', '#4ECDC4', 2),
('Cultural', 'cultural', 'Eventos culturais, teatro e arte', 'palette', '#45B7D1', 3),
('Gastronômico', 'gastronomico', 'Festivais gastronômicos e eventos culinários', 'chef-hat', '#96CEB4', 4),
('Esportivo', 'esportivo', 'Competições e eventos esportivos', 'trophy', '#FFEAA7', 5),
('Gospel', 'gospel', 'Eventos e shows gospel', 'heart', '#DDA0DD', 6),
('Forró', 'forro', 'Eventos de forró e música regional', 'guitar', '#FFB347', 7),
('Natalino', 'natalino', 'Eventos natalinos e de fim de ano', 'gift', '#FF6B6B', 8),
('Empresarial', 'empresarial', 'Eventos corporativos e networking', 'briefcase', '#74B9FF', 9),
('Educacional', 'educacional', 'Workshops, cursos e palestras', 'book-open', '#A29BFE', 10);

-- Subcategorias
INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Forró Tradicional', 'forro-tradicional', 'Forró pé-de-serra tradicional', 'music', '#FFB347', 
    id, 1
FROM public.event_categories WHERE slug = 'forro';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Forró Eletrônico', 'forro-eletronico', 'Forró com instrumentos eletrônicos', 'zap', '#FFB347', 
    id, 2
FROM public.event_categories WHERE slug = 'forro';
```

### **6.2 Eventos de Exemplo**

#### **database/seeds/sample_events.sql:**
```sql
-- Eventos oficiais 2025
INSERT INTO public.events (
    id, title, slug, description, short_description, event_type, category_id, created_by,
    status, is_featured, is_official, start_date, end_date, venue_name, address,
    is_free, banner_image, organizer_info
) VALUES
(
    gen_random_uuid(),
    'Festival de Inverno de Garanhuns 2025',
    'festival-inverno-garanhuns-2025',
    'O maior festival de inverno do Nordeste volta em 2025 com uma programação diversificada que inclui shows nacionais e internacionais, teatro, dança, literatura e gastronomia.',
    'O maior festival de inverno do Nordeste com shows, teatro, dança e gastronomia.',
    'festival',
    (SELECT id FROM event_categories WHERE slug = 'musical'),
    '00000000-0000-0000-0000-000000000002',
    'published',
    true,
    true,
    '2025-07-10 18:00:00-03',
    '2025-07-27 23:59:59-03',
    'Vários locais',
    '{"city": "Garanhuns", "state": "PE", "country": "Brasil"}',
    true,
    '/images/events/fig-2025-banner.jpg',
    '{"name": "Prefeitura de Garanhuns", "contact": "cultura@garanhuns.pe.gov.br"}'
),
(
    gen_random_uuid(),
    'Viva Garanhuns 2025',
    'viva-garanhuns-2025',
    'Festival que celebra a cultura nordestina com shows de forró, quadrilhas, comidas típicas e muito mais.',
    'Festival que celebra a cultura nordestina com forró e tradições.',
    'festival',
    (SELECT id FROM event_categories WHERE slug = 'forro'),
    '00000000-0000-0000-0000-000000000002',
    'published',
    true,
    true,
    '2025-05-01 18:00:00-03',
    '2025-05-04 23:59:59-03',
    'Parque Euclides Dourado',
    '{"street": "Parque Euclides Dourado", "city": "Garanhuns", "state": "PE"}',
    true,
    '/images/events/viva-garanhuns-2025-banner.jpg',
    '{"name": "Prefeitura de Garanhuns", "contact": "cultura@garanhuns.pe.gov.br"}'
);
```

---

## 🔧 Fase 7: Configuração do Realtime

### **7.1 Configuração de Realtime**

#### **supabase/config.toml:**
```toml
[realtime]
enabled = true
max_connections = 100
max_channels_per_client = 100
max_joins_per_second = 100
max_events_per_second = 100

# Configurar quais tabelas terão realtime
[[realtime.tenants]]
name = "realtime"
database = "postgres"
schema = "public"
tables = [
    "events",
    "media", 
    "comments",
    "likes",
    "user_event_interactions",
    "notifications"
]
```

### **7.2 Configuração do Frontend para Realtime**

#### **src/lib/supabase-realtime.js:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

// Configurar subscriptions para likes em tempo real
export const subscribeLikes = (eventId, callback) => {
    return supabase
        .channel(`likes:${eventId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'likes',
            filter: `event_id=eq.${eventId}`
        }, callback)
        .subscribe();
};

// Configurar subscriptions para comentários
export const subscribeComments = (eventId, callback) => {
    return supabase
        .channel(`comments:${eventId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'comments',
            filter: `event_id=eq.${eventId}`
        }, callback)
        .subscribe();
};
```

---

## 📋 Cronograma de Implementação

### **Semana 1: Preparação e Configuração**
- **Dia 1-2:** Configuração do ambiente local PostgreSQL
- **Dia 3-4:** Criação do projeto Supabase e configurações iniciais
- **Dia 5:** Configuração do repositório e estrutura de pastas

### **Semana 2: Migrações e Schema**
- **Dia 1-2:** Criação das migrações principais (users, events, categories)
- **Dia 3-4:** Criação das migrações de mídia e interações sociais
- **Dia 5:** Criação das migrações de sistema e auditoria

### **Semana 3: Políticas de Segurança**
- **Dia 1-2:** Implementação das políticas RLS para usuários e eventos
- **Dia 3-4:** Implementação das políticas para mídia e comentários
- **Dia 5:** Testes e validação das políticas

### **Semana 4: Dados Iniciais e Testes**
- **Dia 1-2:** Criação dos seeds e dados de teste
- **Dia 3-4:** Configuração do Realtime e subscriptions
- **Dia 5:** Testes completos e validação

---

## 🧪 Fase 8: Testes e Validação

### **8.1 Testes de Conectividade**

#### **database/scripts/test_connection.js:**
```javascript
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
    
    console.log('🧪 Testando conexão com Supabase...');
    
    try {
        // Teste básico de consulta
        const { data, error } = await supabase
            .from('event_categories')
            .select('*')
            .limit(1);
            
        if (error) throw error;
        
        console.log('✅ Conexão com Supabase OK');
        console.log('📊 Dados de teste:', data);
        
        // Teste de autenticação
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
            console.log('⚠️  Auth não configurado ainda');
        } else {
            console.log('✅ Sistema de autenticação OK');
        }
        
        // Teste de storage
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
        
        if (storageError) {
            console.log('⚠️  Storage não configurado ainda');
        } else {
            console.log('✅ Storage OK - Buckets:', buckets.map(b => b.name));
        }
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error);
    }
}

testConnection();
```

---

## 🚀 Checklist de Implementação

### **Pré-requisitos:**
- [ ] Conta Supabase criada
- [ ] PostgreSQL local instalado
- [ ] Node.js e npm instalados
- [ ] Variáveis de ambiente configuradas

### **Configuração Local:**
- [ ] Database local criado
- [ ] Todas as migrações executadas
- [ ] Seeds executados
- [ ] Testes de conectividade OK

### **Configuração Supabase:**
- [ ] Projeto Supabase criado
- [ ] Migrações aplicadas
- [ ] Políticas RLS configuradas
- [ ] Storage buckets criados
- [ ] Autenticação configurada
- [ ] Realtime habilitado

### **Testes:**
- [ ] Políticas RLS testadas
- [ ] Upload de arquivos testado
- [ ] Realtime funcionando
- [ ] APIs funcionando
- [ ] Performance OK

### **Produção:**
- [ ] Domínio configurado
- [ ] SSL configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Alertas configurados

---

## 📞 Suporte e Manutenção

### **Documentação:**
- Todas as configurações documentadas
- Scripts de backup e restore
- Procedimentos de emergência
- Contatos de suporte

### **Backup:**
- Backup automático diário
- Backup antes de cada deploy
- Teste de restore mensal
- Armazenamento em múltiplos locais

### **Monitoramento:**
- Logs centralizados
- Métricas em tempo real
- Alertas automáticos
- Relatórios semanais

---

**🎯 Com este planejamento detalhado, teremos uma base sólida e escalável para o Portal de Eventos Garanhuns, integrando perfeitamente o ambiente local de desenvolvimento com a produção no Supabase.**
