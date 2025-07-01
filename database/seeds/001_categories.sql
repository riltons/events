-- Seed 001: Categorias de Eventos
-- Portal de Eventos Garanhuns
-- Data: 2025-01-26

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
('Educacional', 'educacional', 'Workshops, cursos e palestras', 'book-open', '#A29BFE', 10),
('Social', 'social', 'Eventos sociais e comunitários', 'users', '#FD79A8', 11),
('Juvenil', 'juvenil', 'Eventos voltados para o público jovem', 'star', '#FDCB6E', 12);

-- Inserir subcategorias de Forró
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

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Forró Universitário', 'forro-universitario', 'Forró voltado para o público universitário', 'graduation-cap', '#FFB347', 
    id, 3
FROM public.event_categories WHERE slug = 'forro';

-- Inserir subcategorias de Musical
INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Rock', 'rock', 'Shows e eventos de rock', 'guitar', '#FF6B35', 
    id, 1
FROM public.event_categories WHERE slug = 'musical';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'MPB', 'mpb', 'Música Popular Brasileira', 'mic', '#FF6B35', 
    id, 2
FROM public.event_categories WHERE slug = 'musical';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Jazz', 'jazz', 'Shows de jazz e música instrumental', 'saxophone', '#FF6B35', 
    id, 3
FROM public.event_categories WHERE slug = 'musical';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Sertanejo', 'sertanejo', 'Shows de música sertaneja', 'cowboy-hat', '#FF6B35', 
    id, 4
FROM public.event_categories WHERE slug = 'musical';

-- Inserir subcategorias de Cultural
INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Teatro', 'teatro', 'Peças teatrais e espetáculos', 'theater', '#45B7D1', 
    id, 1
FROM public.event_categories WHERE slug = 'cultural';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Dança', 'danca', 'Apresentações de dança e ballet', 'dance', '#45B7D1', 
    id, 2
FROM public.event_categories WHERE slug = 'cultural';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Literatura', 'literatura', 'Eventos literários, saraus e lançamentos', 'book', '#45B7D1', 
    id, 3
FROM public.event_categories WHERE slug = 'cultural';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Artes Visuais', 'artes-visuais', 'Exposições, vernissages e mostras de arte', 'palette', '#45B7D1', 
    id, 4
FROM public.event_categories WHERE slug = 'cultural';

-- Inserir subcategorias de Religioso
INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Católico', 'catolico', 'Eventos da Igreja Católica', 'cross', '#4ECDC4', 
    id, 1
FROM public.event_categories WHERE slug = 'religioso';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Evangélico', 'evangelico', 'Eventos evangélicos e protestantes', 'bible', '#4ECDC4', 
    id, 2
FROM public.event_categories WHERE slug = 'religioso';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Ecumênico', 'ecumenico', 'Eventos inter-religiosos', 'hands', '#4ECDC4', 
    id, 3
FROM public.event_categories WHERE slug = 'religioso';

-- Inserir subcategorias de Esportivo
INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Futebol', 'futebol', 'Jogos e torneios de futebol', 'football', '#FFEAA7', 
    id, 1
FROM public.event_categories WHERE slug = 'esportivo';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Corrida', 'corrida', 'Corridas de rua e maratonas', 'runner', '#FFEAA7', 
    id, 2
FROM public.event_categories WHERE slug = 'esportivo';

INSERT INTO public.event_categories (name, slug, description, icon, color, parent_id, sort_order) 
SELECT 
    'Ciclismo', 'ciclismo', 'Passeios e competições de ciclismo', 'bike', '#FFEAA7', 
    id, 3
FROM public.event_categories WHERE slug = 'esportivo';

-- Comentário de conclusão
INSERT INTO public.event_categories (name, slug, description, icon, color, sort_order, is_active) VALUES
('Teste', 'teste', 'Categoria para testes (não ativa)', 'flask', '#6C5CE7', 999, false);

-- Log de inserção
DO $$
DECLARE
    total_categories INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_categories FROM public.event_categories;
    RAISE NOTICE 'Seed concluído: % categorias inseridas', total_categories;
END $$; 