-- Migração 006: Criar tabela de notícias vinculadas aos eventos
-- Portal de Eventos Garanhuns

-- Tabela de notícias relacionadas aos eventos
CREATE TABLE event_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    summary VARCHAR(500),
    author_name VARCHAR(100) DEFAULT 'Redação Portal de Eventos',
    author_email VARCHAR(150),
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_event_news_event_id ON event_news(event_id);
CREATE INDEX idx_event_news_published ON event_news(is_published, published_at DESC);
CREATE INDEX idx_event_news_featured ON event_news(is_featured, published_at DESC);
CREATE INDEX idx_event_news_slug ON event_news(slug);

-- Comentários nas colunas
COMMENT ON TABLE event_news IS 'Notícias relacionadas aos eventos';
COMMENT ON COLUMN event_news.event_id IS 'Referência ao evento relacionado';
COMMENT ON COLUMN event_news.title IS 'Título da notícia';
COMMENT ON COLUMN event_news.slug IS 'URL amigável da notícia';
COMMENT ON COLUMN event_news.content IS 'Conteúdo completo da notícia';
COMMENT ON COLUMN event_news.summary IS 'Resumo/preview da notícia';
COMMENT ON COLUMN event_news.is_published IS 'Se a notícia está publicada';
COMMENT ON COLUMN event_news.is_featured IS 'Se a notícia é destaque';
COMMENT ON COLUMN event_news.published_at IS 'Data de publicação';

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_news_updated_at 
    BEFORE UPDATE ON event_news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir algumas notícias de exemplo para o Festival de Forró
DO $$
DECLARE 
    festival_id UUID;
BEGIN
    -- Buscar o ID do Festival de Forró
    SELECT id INTO festival_id 
    FROM events 
    WHERE slug = 'festival-forro-garanhuns-2025' 
    LIMIT 1;
    
    -- Se encontrar o evento, inserir notícias de exemplo
    IF festival_id IS NOT NULL THEN
        INSERT INTO event_news (event_id, title, slug, content, summary, is_published, is_featured, published_at) VALUES
        (
            festival_id,
            'Confirmadas as principais atrações do Festival de Forró 2025',
            'confirmadas-atracoes-festival-forro-2025',
            'O Festival de Forró de Garanhuns 2025 terá grandes nomes da música nordestina. Entre os confirmados estão Alceu Valença, Elba Ramalho, Dominguinhos Jr., e muitos outros artistas que prometem agitar o público com muito forró, quadrilha e tradição nordestina.',
            'Grandes nomes da música nordestina confirmados para o maior festival de forró do agreste pernambucano.',
            TRUE,
            TRUE,
            NOW() - INTERVAL '2 days'
        ),
        (
            festival_id,
            'Programação infantil especial no Festival de Forró',
            'programacao-infantil-festival-forro-2025',
            'Para as famílias, o Festival de Forró 2025 contará com uma programação especial para as crianças, incluindo oficinas de quadrilha, apresentações de teatro de bonecos, e um espaço kids com atividades recreativas supervisionadas.',
            'Atividades especiais para crianças garantem diversão para toda a família.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '1 day'
        ),
        (
            festival_id,
            'Gastronomia típica será destaque no festival',
            'gastronomia-tipica-festival-forro-2025',
            'A culinária nordestina terá espaço especial no Festival de Forró 2025. Food trucks e barracas oferecerão pratos típicos como carne de sol, macaxeira, queijo coalho, paçoca de pilão, e outras delícias regionais.',
            'Sabores autênticos da culinária nordestina complementam a experiência musical.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '6 hours'
        ),
        (
            festival_id,
            'Ingressos para camarotes já estão disponíveis',
            'ingressos-camarotes-festival-forro-2025',
            'Os ingressos para os camarotes VIP do Festival de Forró 2025 já estão à venda. Os camarotes oferecem vista privilegiada do palco principal, bar exclusivo, e área de descanso climatizada.',
            'Experiência premium disponível para quem busca ainda mais conforto.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '3 hours'
        );
    END IF;
END $$; 