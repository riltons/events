# Portal de Eventos Garanhuns - Jornadas dos Usuários e Schema do Banco

## 📋 Visão Geral

Este documento detalha as personas, jornadas dos usuários e o schema do banco de dados PostgreSQL para o Portal de Eventos Garanhuns, considerando os diferentes níveis de acesso e funcionalidades do sistema.

---

## 👥 Personas e Níveis de Usuário

### 🔑 1. Usuário Master (Super Administrador)
**Persona: Maria Santos - Secretária de Cultura**
- **Idade:** 45 anos
- **Cargo:** Secretária Municipal de Cultura
- **Responsabilidades:** Gerenciamento geral da plataforma, aprovação de conteúdo estratégico
- **Objetivos:** Garantir que o portal represente adequadamente a cultura de Garanhuns
- **Tecnologia:** Usuário intermediário, prefere interfaces simples e diretas
- **Contexto:** Trabalha principalmente durante horário comercial, acessa via desktop

**Permissões:**
- Acesso total ao sistema
- Gerenciamento de usuários e permissões
- Configurações globais da plataforma
- Aprovação de eventos oficiais de grande porte
- Moderação de conteúdo sensível
- Acesso a relatórios e analytics completos

### 👨‍💼 2. Administrador de Eventos
**Persona: João Silva - Coordenador de Eventos Municipais**
- **Idade:** 38 anos
- **Cargo:** Coordenador de Eventos da Prefeitura
- **Responsabilidades:** Gestão dos eventos oficiais municipais
- **Objetivos:** Divulgar eficientemente os eventos oficiais e controlar a agenda municipal
- **Tecnologia:** Usuário avançado, confortável com sistemas web
- **Contexto:** Trabalha em horário comercial, precisa de atualizações rápidas durante eventos

**Permissões:**
- CRUD completo de eventos oficiais
- Gerenciamento de categorias de eventos
- Aprovação de eventos privados que requerem autorização municipal
- Moderação de mídias relacionadas a eventos oficiais
- Acesso a relatórios de eventos

### ✍️ 3. Redator de Notícias
**Persona: Ana Paula - Jornalista Cultural**
- **Idade:** 32 anos
- **Cargo:** Jornalista da Assessoria de Comunicação
- **Responsabilidades:** Cobertura jornalística e criação de conteúdo sobre eventos
- **Objetivos:** Criar conteúdo atrativo e informativo sobre os eventos da cidade
- **Tecnologia:** Usuário avançado, familiar com CMS e ferramentas de edição
- **Contexto:** Trabalha em horários irregulares, especialmente durante grandes eventos

**Permissões:**
- Criação e edição de notícias e artigos
- Upload de mídias para matérias
- Agendamento de publicações
- Cobertura em tempo real de eventos
- Acesso a galeria de mídias do sistema

### 🎪 4. Usuário Criador de Eventos (Empresarial)
**Persona: Carlos Mendes - Proprietário de Casa de Shows**
- **Idade:** 42 anos
- **Cargo:** Empresário do ramo de entretenimento
- **Responsabilidades:** Divulgação de eventos privados do seu estabelecimento
- **Objetivos:** Aumentar a visibilidade e público dos seus eventos
- **Tecnologia:** Usuário intermediário, usa principalmente smartphone
- **Contexto:** Trabalha principalmente à noite, precisa de cadastro rápido e simples

**Permissões:**
- Cadastro de eventos privados/comerciais
- Upload de mídias promocionais
- Gerenciamento dos próprios eventos
- Visualização de estatísticas dos próprios eventos
- Interação com usuários interessados

### 👤 5. Usuário Final (Consumidor)
**Persona: Fernanda Costa - Estudante Universitária**
- **Idade:** 22 anos
- **Ocupação:** Estudante de Turismo
- **Responsabilidades:** Buscar entretenimento e eventos culturais
- **Objetivos:** Descobrir eventos interessantes, interagir socialmente, compartilhar experiências
- **Tecnologia:** Nativa digital, usa principalmente smartphone
- **Contexto:** Acessa principalmente à noite e fins de semana, busca eventos gratuitos ou acessíveis

**Permissões:**
- Visualização de eventos e notícias
- Interação social (curtidas, comentários, compartilhamentos)
- Upload de fotos/vídeos em eventos
- Marcação de outros usuários
- Criação de perfil personalizado
- Sistema de favoritos

---

## 🗺️ Jornadas dos Usuários

### 🔑 Jornada do Usuário Master

#### **Cenário: Preparação para o Festival de Inverno**
1. **Acesso ao Dashboard Master**
   - Login com credenciais de super administrador
   - Visualização de métricas gerais da plataforma
   - Verificação de alertas e notificações críticas

2. **Configuração de Evento Oficial**
   - Criação da categoria "Festival de Inverno 2025"
   - Definição de administradores específicos para o evento
   - Configuração de workflows de aprovação

3. **Monitoramento e Supervisão**
   - Acompanhamento de aprovações pendentes
   - Revisão de conteúdo reportado pelos usuários
   - Análise de relatórios de uso da plataforma

4. **Tomada de Decisões Estratégicas**
   - Aprovação/rejeição de funcionalidades propostas
   - Definição de políticas de uso da plataforma

### 👨‍💼 Jornada do Administrador de Eventos

#### **Cenário: Cadastro do Viva Garanhuns 2025**
1. **Preparação do Evento**
   - Login no sistema administrativo
   - Acesso à seção de eventos oficiais
   - Preparação de materiais (fotos, vídeos, programação)

2. **Cadastro Detalhado**
   - Criação do evento principal "Viva Garanhuns 2025"
   - Cadastro de sub-eventos (shows por dia/local)
   - Upload de materiais promocionais
   - Definição de informações logísticas

3. **Coordenação com Equipe**
   - Atribuição de permissões para redatores
   - Briefing da equipe de cobertura
   - Configuração de notificações automáticas

4. **Acompanhamento Durante o Evento**
   - Monitoramento de mídias enviadas pelos usuários
   - Aprovação de conteúdo em tempo real
   - Atualização de informações conforme necessário

### ✍️ Jornada do Redator de Notícias

#### **Cenário: Cobertura do Garanhuns Jazz Festival**
1. **Preparação da Cobertura**
   - Acesso ao sistema editorial
   - Revisão da pauta e cronograma do evento
   - Preparação de templates de matérias

2. **Cobertura Pré-Evento**
   - Criação de matéria de expectativa
   - Entrevistas com organizadores
   - Publicação de programação detalhada

3. **Cobertura Durante o Evento**
   - Publicação de updates em tempo real
   - Upload de fotos e vídeos da cobertura
   - Interação com o público através de comentários

4. **Cobertura Pós-Evento**
   - Matéria de encerramento com galeria de fotos
   - Entrevistas com participantes
   - Análise de repercussão e engajamento

### 🎪 Jornada do Usuário Criador de Eventos

#### **Cenário: Divulgação de Show no Bar**
1. **Descoberta e Cadastro**
   - Descoberta do portal através de recomendação
   - Cadastro como usuário empresarial
   - Verificação e aprovação do perfil

2. **Criação do Primeiro Evento**
   - Acesso ao formulário de criação de eventos
   - Preenchimento de informações do show
   - Upload de materiais promocionais
   - Submissão para aprovação

3. **Acompanhamento e Engajamento**
   - Monitoramento de visualizações e interesse
   - Resposta a comentários e dúvidas
   - Compartilhamento em redes sociais

4. **Análise de Resultados**
   - Verificação de métricas de alcance
   - Avaliação do ROI da divulgação
   - Planejamento de eventos futuros

### 👤 Jornada do Usuário Final

#### **Cenário: Participação no Festival Gospel**
1. **Descoberta do Evento**
   - Acesso ao portal via busca no Google
   - Navegação por eventos em destaque
   - Uso de filtros para encontrar eventos religiosos

2. **Exploração e Decisão**
   - Visualização detalhada do Festival Gospel
   - Leitura de comentários de outros usuários
   - Verificação de localização e programação
   - Adição aos favoritos

3. **Preparação para o Evento**
   - Criação de conta no portal
   - Configuração de notificações
   - Compartilhamento com amigos

4. **Participação e Interação**
   - Check-in no evento através do app
   - Upload de fotos e vídeos durante o festival
   - Marcação de amigos nas publicações
   - Interação com outras publicações

5. **Pós-Evento**
   - Avaliação do evento
   - Compartilhamento de experiências
   - Busca por próximos eventos similares

---

## 🗃️ Schema do Banco de Dados PostgreSQL

### **Tabela: users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
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
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    permissions JSONB DEFAULT '{}',
    organization_name VARCHAR(100), -- Para usuários empresariais
    organization_type VARCHAR(50),  -- bar, restaurante, casa_de_shows, etc.
    cnpj VARCHAR(18),
    address JSONB,
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}'
);

-- Enums
CREATE TYPE user_type_enum AS ENUM (
    'master', 
    'event_admin', 
    'news_editor', 
    'event_creator', 
    'end_user'
);

CREATE TYPE user_status_enum AS ENUM (
    'active', 
    'inactive', 
    'pending_approval', 
    'suspended', 
    'banned'
);
```

### **Tabela: events**
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    event_type event_type_enum NOT NULL,
    category_id UUID REFERENCES event_categories(id),
    created_by UUID REFERENCES users(id) NOT NULL,
    approved_by UUID REFERENCES users(id),
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
    address JSONB, -- {street, number, neighborhood, city, state, zip_code, country}
    location_coordinates POINT, -- Para integração com mapas
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
    ticket_info JSONB, -- {prices: [{category, price, description}], sales_url, sales_info}
    
    -- Contato e links
    contact_info JSONB, -- {phone, email, whatsapp, website}
    social_links JSONB, -- {instagram, facebook, twitter, etc}
    external_links JSONB, -- {website, tickets, streaming, etc}
    
    -- Organização
    organizer_info JSONB, -- {name, description, contact, logo}
    sponsors JSONB[], -- [{name, logo, url, tier}]
    
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

-- Enums para eventos
CREATE TYPE event_type_enum AS ENUM (
    'musical', 'cultural', 'religious', 'sports', 'gastronomic', 
    'business', 'educational', 'social', 'artistic', 'festival',
    'conference', 'workshop', 'exhibition', 'competition'
);

CREATE TYPE event_status_enum AS ENUM (
    'draft', 'pending_approval', 'approved', 'published', 
    'cancelled', 'postponed', 'completed', 'rejected'
);
```

### **Tabela: event_categories**
```sql
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES event_categories(id),
    icon VARCHAR(50), -- Classe do ícone (Lucide, FontAwesome, etc)
    color VARCHAR(7), -- Cor hex para identificação visual
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
```

### **Tabela: media**
```sql
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) NOT NULL,
    uploaded_by UUID REFERENCES users(id) NOT NULL,
    approved_by UUID REFERENCES users(id),
    
    -- Informações do arquivo
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    media_type media_type_enum NOT NULL,
    
    -- Metadata da mídia
    title VARCHAR(200),
    description TEXT,
    alt_text VARCHAR(500),
    
    -- Dados técnicos (para imagens)
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- Para vídeos (em segundos)
    
    -- Status e aprovação
    status media_status_enum DEFAULT 'pending_approval',
    is_featured BOOLEAN DEFAULT FALSE,
    is_cover BOOLEAN DEFAULT FALSE,
    
    -- Interações sociais
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Marcações de usuários
    tagged_users UUID[], -- Array de IDs de usuários marcados
    tags TEXT[], -- Tags livres
    
    -- Localização (se disponível nos metadados)
    location_coordinates POINT,
    location_name VARCHAR(200),
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TYPE media_type_enum AS ENUM ('image', 'video', 'audio', 'document');
CREATE TYPE media_status_enum AS ENUM ('pending_approval', 'approved', 'rejected', 'flagged');
```

### **Tabela: news_articles**
```sql
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    subtitle VARCHAR(500),
    content TEXT NOT NULL,
    excerpt VARCHAR(1000),
    
    -- Autor e editor
    author_id UUID REFERENCES users(id) NOT NULL,
    editor_id UUID REFERENCES users(id),
    
    -- Status de publicação
    status article_status_enum NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_breaking_news BOOLEAN DEFAULT FALSE,
    
    -- Mídia
    featured_image TEXT,
    featured_image_caption TEXT,
    gallery_images TEXT[],
    
    -- Relacionamentos
    related_events UUID[], -- Array de IDs de eventos relacionados
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

CREATE TYPE article_status_enum AS ENUM (
    'draft', 'review', 'approved', 'published', 
    'scheduled', 'archived', 'deleted'
);
```

### **Tabela: comments**
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    
    -- Pode ser comentário em evento, mídia ou notícia
    event_id UUID REFERENCES events(id),
    media_id UUID REFERENCES media(id),
    article_id UUID REFERENCES news_articles(id),
    
    -- Para replies/respostas
    parent_comment_id UUID REFERENCES comments(id),
    
    content TEXT NOT NULL,
    status comment_status_enum DEFAULT 'approved',
    
    -- Interações
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Restrições
    CHECK (
        (event_id IS NOT NULL AND media_id IS NULL AND article_id IS NULL) OR
        (event_id IS NULL AND media_id IS NOT NULL AND article_id IS NULL) OR
        (event_id IS NULL AND media_id IS NULL AND article_id IS NOT NULL)
    )
);

CREATE TYPE comment_status_enum AS ENUM ('pending', 'approved', 'rejected', 'flagged');
```

### **Tabela: likes**
```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    
    -- Pode ser like em evento, mídia, notícia ou comentário
    event_id UUID REFERENCES events(id),
    media_id UUID REFERENCES media(id),
    article_id UUID REFERENCES news_articles(id),
    comment_id UUID REFERENCES comments(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint para evitar likes duplicados
    UNIQUE(user_id, event_id),
    UNIQUE(user_id, media_id),
    UNIQUE(user_id, article_id),
    UNIQUE(user_id, comment_id),
    
    -- Restrições - apenas um tipo por like
    CHECK (
        (event_id IS NOT NULL AND media_id IS NULL AND article_id IS NULL AND comment_id IS NULL) OR
        (event_id IS NULL AND media_id IS NOT NULL AND article_id IS NULL AND comment_id IS NULL) OR
        (event_id IS NULL AND media_id IS NULL AND article_id IS NOT NULL AND comment_id IS NULL) OR
        (event_id IS NULL AND media_id IS NULL AND article_id IS NULL AND comment_id IS NOT NULL)
    )
);
```

### **Tabela: user_event_interactions**
```sql
CREATE TABLE user_event_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    event_id UUID REFERENCES events(id) NOT NULL,
    interaction_type interaction_type_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint para evitar interações duplicadas do mesmo tipo
    UNIQUE(user_id, event_id, interaction_type)
);

CREATE TYPE interaction_type_enum AS ENUM (
    'interested', 'going', 'maybe', 'not_going', 'favorite', 'shared'
);
```

### **Tabela: notifications**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    type notification_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Dados relacionados (JSON flexível)
    data JSONB DEFAULT '{}',
    
    -- URLs para ação
    action_url TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    
    -- Canais de envio
    send_email BOOLEAN DEFAULT FALSE,
    send_push BOOLEAN DEFAULT TRUE,
    send_sms BOOLEAN DEFAULT FALSE,
    
    -- Agendamento
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TYPE notification_type_enum AS ENUM (
    'event_reminder', 'event_update', 'event_cancelled', 'new_event_nearby',
    'media_approved', 'media_rejected', 'comment_reply', 'like_received',
    'article_published', 'system_update', 'welcome', 'account_verification'
);
```

### **Tabelas de Sistema e Configuração**

#### **Tabela: system_settings**
```sql
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurações iniciais
INSERT INTO system_settings (key, value, description, is_public) VALUES
('site_name', '"Portal de Eventos Garanhuns"', 'Nome do site', true),
('site_description', '"Portal oficial de eventos da cidade de Garanhuns/PE"', 'Descrição do site', true),
('contact_email', '"contato@eventosgaranhuns.com.br"', 'Email de contato', true),
('social_links', '{"instagram": "@eventosgaranhuns", "facebook": "eventosgaranhuns"}', 'Links das redes sociais', true),
('file_upload_limits', '{"max_image_size": 5242880, "max_video_size": 52428800, "allowed_types": ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi"]}', 'Limites de upload de arquivos', false),
('approval_settings', '{"auto_approve_media": false, "auto_approve_events": false, "auto_approve_comments": true}', 'Configurações de aprovação automática', false);
```

#### **Tabela: audit_logs**
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔗 Relacionamentos e Índices

### **Índices Principais**
```sql
-- Índices para performance
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_location ON events USING GIST(location_coordinates);

CREATE INDEX idx_media_event_id ON media(event_id);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_status ON media(status);
CREATE INDEX idx_media_created_at ON media(created_at);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_comments_event_id ON comments(event_id);
CREATE INDEX idx_comments_media_id ON comments(media_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_event_id ON likes(event_id);
CREATE INDEX idx_likes_media_id ON likes(media_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
```

### **Views Úteis**
```sql
-- View para eventos com estatísticas completas
CREATE VIEW events_with_stats AS
SELECT 
    e.*,
    COALESCE(media_count.count, 0) as media_count,
    COALESCE(comment_count.count, 0) as comment_count,
    COALESCE(like_count.count, 0) as like_count,
    COALESCE(interested_count.count, 0) as interested_count,
    COALESCE(going_count.count, 0) as going_count,
    c.name as category_name,
    c.color as category_color,
    u.full_name as creator_name
FROM events e
LEFT JOIN event_categories c ON e.category_id = c.id
LEFT JOIN users u ON e.created_by = u.id
LEFT JOIN (
    SELECT event_id, COUNT(*) as count 
    FROM media 
    WHERE status = 'approved' 
    GROUP BY event_id
) media_count ON e.id = media_count.event_id
LEFT JOIN (
    SELECT event_id, COUNT(*) as count 
    FROM comments 
    WHERE status = 'approved' 
    GROUP BY event_id
) comment_count ON e.id = comment_count.event_id
LEFT JOIN (
    SELECT event_id, COUNT(*) as count 
    FROM likes 
    WHERE event_id IS NOT NULL 
    GROUP BY event_id
) like_count ON e.id = like_count.event_id
LEFT JOIN (
    SELECT event_id, COUNT(*) as count 
    FROM user_event_interactions 
    WHERE interaction_type = 'interested' 
    GROUP BY event_id
) interested_count ON e.id = interested_count.event_id
LEFT JOIN (
    SELECT event_id, COUNT(*) as count 
    FROM user_event_interactions 
    WHERE interaction_type = 'going' 
    GROUP BY event_id
) going_count ON e.id = going_count.event_id;

-- View para usuários com estatísticas
CREATE VIEW users_with_stats AS
SELECT 
    u.*,
    COALESCE(events_created.count, 0) as events_created_count,
    COALESCE(media_uploaded.count, 0) as media_uploaded_count,
    COALESCE(comments_made.count, 0) as comments_made_count
FROM users u
LEFT JOIN (
    SELECT created_by, COUNT(*) as count 
    FROM events 
    WHERE status IN ('approved', 'published') 
    GROUP BY created_by
) events_created ON u.id = events_created.created_by
LEFT JOIN (
    SELECT uploaded_by, COUNT(*) as count 
    FROM media 
    WHERE status = 'approved' 
    GROUP BY uploaded_by
) media_uploaded ON u.id = media_uploaded.uploaded_by
LEFT JOIN (
    SELECT user_id, COUNT(*) as count 
    FROM comments 
    WHERE status = 'approved' 
    GROUP BY user_id
) comments_made ON u.id = comments_made.user_id;
```

---

## 🔒 Triggers para Auditoria e Contadores

### **Trigger para Audit Log**
```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (action, table_name, record_id, new_values)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (action, table_name, record_id, old_values, new_values)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (action, table_name, record_id, old_values)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar o trigger nas tabelas principais
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_events AFTER INSERT OR UPDATE OR DELETE ON events 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_media AFTER INSERT OR UPDATE OR DELETE ON media 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### **Triggers para Contadores Automáticos**
```sql
-- Trigger para atualizar contadores de likes
CREATE OR REPLACE FUNCTION update_like_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.event_id IS NOT NULL THEN
            UPDATE events SET like_count = like_count + 1 WHERE id = NEW.event_id;
        ELSIF NEW.media_id IS NOT NULL THEN
            UPDATE media SET like_count = like_count + 1 WHERE id = NEW.media_id;
        ELSIF NEW.article_id IS NOT NULL THEN
            UPDATE news_articles SET like_count = like_count + 1 WHERE id = NEW.article_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.event_id IS NOT NULL THEN
            UPDATE events SET like_count = like_count - 1 WHERE id = OLD.event_id;
        ELSIF OLD.media_id IS NOT NULL THEN
            UPDATE media SET like_count = like_count - 1 WHERE id = OLD.media_id;
        ELSIF OLD.article_id IS NOT NULL THEN
            UPDATE news_articles SET like_count = like_count - 1 WHERE id = OLD.article_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_counter_trigger 
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_like_counters();

-- Trigger similar para comentários
CREATE OR REPLACE FUNCTION update_comment_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.event_id IS NOT NULL THEN
            UPDATE events SET comment_count = comment_count + 1 WHERE id = NEW.event_id;
        ELSIF NEW.media_id IS NOT NULL THEN
            UPDATE media SET comment_count = comment_count + 1 WHERE id = NEW.media_id;
        ELSIF NEW.article_id IS NOT NULL THEN
            UPDATE news_articles SET comment_count = comment_count + 1 WHERE id = NEW.article_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.event_id IS NOT NULL THEN
            UPDATE events SET comment_count = comment_count - 1 WHERE id = OLD.event_id;
        ELSIF OLD.media_id IS NOT NULL THEN
            UPDATE media SET comment_count = comment_count - 1 WHERE id = OLD.media_id;
        ELSIF OLD.article_id IS NOT NULL THEN
            UPDATE news_articles SET comment_count = comment_count - 1 WHERE id = OLD.article_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comments_counter_trigger 
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comment_counters();
```

---

## 📊 Considerações de Performance e Escalabilidade

### **Estratégias de Otimização**
1. **Particionamento de Tabelas**
   - Particionar `audit_logs` por data
   - Particionar `notifications` por data
   - Considerar particionamento de `media` por evento para grandes volumes

2. **Caching**
   - Cache de contadores de likes/comentários
   - Cache de eventos populares
   - Cache de categorias e configurações do sistema

3. **Arquivamento**
   - Política de arquivamento para eventos antigos
   - Limpeza automática de logs de auditoria antigos
   - Compressão de mídias antigas

### **Monitoramento**
```sql
-- Query para monitorar performance
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('events', 'media', 'users', 'comments')
ORDER BY tablename, attname;

-- Estatísticas de uso das tabelas
SELECT 
    t.table_name,
    pg_size_pretty(pg_total_relation_size(c.oid)) as size,
    pg_stat_get_tuples_inserted(c.oid) as inserted,
    pg_stat_get_tuples_updated(c.oid) as updated,
    pg_stat_get_tuples_deleted(c.oid) as deleted
FROM information_schema.tables t
JOIN pg_class c ON c.relname = t.table_name
WHERE t.table_schema = 'public'
AND t.table_type = 'BASE TABLE'
ORDER BY pg_total_relation_size(c.oid) DESC;
```

---

## 🔚 Conclusão

Este schema foi projetado para suportar todas as funcionalidades identificadas nas jornadas dos usuários, proporcionando:

- **Flexibilidade** para diferentes tipos de usuários e permissões
- **Escalabilidade** para crescimento futuro da plataforma
- **Integridade** através de constraints e relacionamentos bem definidos
- **Performance** através de índices estratégicos
- **Auditoria** completa de todas as operações críticas
- **Extensibilidade** para futuras funcionalidades

O design permite que cada tipo de usuário tenha suas necessidades atendidas de forma eficiente, desde o usuário master com controle total até o usuário final que busca uma experiência social rica e envolvente. 