-- Migration 003: Criar Tabela de Perfis de Usuários
-- Portal de Eventos Garanhuns
-- Data: 2025-01-26

-- Para ambiente local, criar tabela auth.users básica se não existir
CREATE SCHEMA IF NOT EXISTS auth;

-- Tabela básica de usuários para ambiente local (será substituída pelo Supabase auth)
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    raw_user_meta_data JSONB DEFAULT '{}'::jsonb
);

-- Tabela de perfis de usuários (estende auth.users)
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

-- Políticas de segurança
-- Usuários podem ver perfis públicos
CREATE POLICY "Users can view public profiles" ON public.user_profiles 
FOR SELECT USING (true);

-- Usuários podem editar apenas o próprio perfil
CREATE POLICY "Users can edit own profile" ON public.user_profiles 
FOR UPDATE USING (id = auth.uid());

-- Usuários podem inserir próprio perfil
CREATE POLICY "Users can insert own profile" ON public.user_profiles 
FOR INSERT WITH CHECK (id = auth.uid());

-- Apenas masters podem deletar perfis
CREATE POLICY "Only masters can delete profiles" ON public.user_profiles 
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND user_type = 'master'
    )
);

-- Função para obter o UUID do usuário atual (compatibilidade local)
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID AS $$
BEGIN
    -- Para ambiente local, pode retornar NULL ou um UUID específico
    -- No Supabase, esta função será substituída automaticamente
    RETURN COALESCE(current_setting('app.current_user_id', true)::uuid, NULL);
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar perfil automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(new.raw_user_meta_data ->> 'avatar_url', '')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_email_verified ON user_profiles(email_verified);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_organization_type ON user_profiles(organization_type);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Índice para busca textual
CREATE INDEX idx_user_profiles_search ON user_profiles USING gin(
    to_tsvector('portuguese', COALESCE(full_name, '') || ' ' || COALESCE(username, '') || ' ' || COALESCE(bio, ''))
);

-- Comentários
COMMENT ON TABLE user_profiles IS 'Perfis estendidos dos usuários do sistema';
COMMENT ON COLUMN user_profiles.user_type IS 'Tipo de usuário que define permissões';
COMMENT ON COLUMN user_profiles.status IS 'Status atual do usuário no sistema';
COMMENT ON COLUMN user_profiles.preferences IS 'Preferências do usuário em formato JSON';
COMMENT ON COLUMN user_profiles.permissions IS 'Permissões específicas do usuário em formato JSON';
COMMENT ON COLUMN user_profiles.notification_settings IS 'Configurações de notificações do usuário';
COMMENT ON COLUMN user_profiles.address IS 'Endereço do usuário em formato JSON';
COMMENT ON COLUMN user_profiles.cnpj IS 'CNPJ para usuários empresariais'; 