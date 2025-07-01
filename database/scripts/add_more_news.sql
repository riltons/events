-- Script para adicionar mais notícias ao Festival de Forró de Garanhuns 2025
-- Portal de Eventos Garanhuns

-- Inserir 5 notícias adicionais para o Festival de Forró
DO $$
DECLARE 
    festival_id UUID;
BEGIN
    -- Buscar o ID do Festival de Forró
    SELECT id INTO festival_id 
    FROM events 
    WHERE slug = 'festival-forro-garanhuns-2025' 
    LIMIT 1;
    
    -- Se encontrar o evento, inserir as novas notícias
    IF festival_id IS NOT NULL THEN
        INSERT INTO event_news (event_id, title, slug, content, summary, is_published, is_featured, published_at) VALUES
        (
            festival_id,
            'Estrutura completa montada no Parque Ruber van der Linden',
            'estrutura-completa-montada-parque-ruber',
            'A montagem da estrutura do Festival de Forró 2025 foi concluída no Parque Ruber van der Linden. São mais de 20 mil metros quadrados de área com palco principal de 800m², área VIP climatizada, praça de alimentação com 40 estandes e estacionamento para 2 mil veículos. A produção confirma que tudo está pronto para receber o público.',
            'Montagem finalizada com palco principal, área VIP e infraestrutura completa para o maior festival da região.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '30 minutes'
        ),
        (
            festival_id,
            'Transporte público gratuito será oferecido durante o festival',
            'transporte-publico-gratuito-festival-forro',
            'A Prefeitura de Garanhuns anuncia que haverá transporte público gratuito durante os três dias do Festival de Forró 2025. Ônibus especiais farão o trajeto dos principais bairros da cidade até o Parque Ruber van der Linden, funcionando das 17h às 2h da manhã. Também haverá shuttle gratuito partindo do centro da cidade.',
            'Ônibus gratuitos conectarão toda a cidade ao local do festival nos três dias de evento.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '2 hours'
        ),
        (
            festival_id,
            'Elba Ramalho confirma repertório especial para Garanhuns',
            'elba-ramalho-repertorio-especial-garanhuns',
            'A cantora Elba Ramalho, uma das principais atrações do Festival de Forró 2025, confirmou que preparou um repertório especial para o público de Garanhuns. Além dos sucessos como "Chão de Giz" e "Bate Coração", ela interpretará clássicos do forró pé-de-serra e promete homenagear Luiz Gonzaga com uma sequência de suas músicas mais famosas.',
            'Rainha do forró prepara show especial com clássicos e homenagem a Luiz Gonzaga.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '4 hours'
        ),
        (
            festival_id,
            'Concurso de quadrilhas juninas terá premiação de R$ 15 mil',
            'concurso-quadrilhas-premiacao-15-mil',
            'O Festival de Forró 2025 realizará o maior concurso de quadrilhas juninas da região, com premiação total de R$ 15 mil. As inscrições estão abertas até quinta-feira para grupos de toda a microrregião. Serão premiadas as três melhores quadrilhas nas categorias adulto e juvenil, além de prêmios especiais para melhor figurino e coreografia mais criativa.',
            'Maior concurso de quadrilhas da região com R$ 15 mil em prêmios para os participantes.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '8 hours'
        ),
        (
            festival_id,
            'Alceu Valença fará participação especial no show de abertura',
            'alceu-valenca-participacao-especial-abertura',
            'O cantor e compositor Alceu Valença fará uma participação especial no show de abertura do Festival de Forró 2025. O artista, que é natural de São Bento do Una (próximo a Garanhuns), subirá ao palco para interpretar seus clássicos como "Anunciação", "Tropicana" e "La Belle de Jour", além de uma versão especial de "Morena Tropicana" em dueto com Elba Ramalho.',
            'Ícone da música pernambucana abre o festival com clássicos e dueto especial.',
            TRUE,
            TRUE,
            NOW() - INTERVAL '12 hours'
        ),
        (
            festival_id,
            'Festival terá área kids com oficinas e apresentações especiais',
            'area-kids-oficinas-apresentacoes-especiais',
            'O Festival de Forró 2025 contará com uma área kids completamente estruturada, com oficinas de sanfona, zabumba e triângulo para crianças de 6 a 14 anos. Haverá também apresentações de teatro de bonecos contando a história do forró, pintura facial temática e uma mini quadrilha infantil. A área funcionará das 18h às 22h nos três dias do evento.',
            'Espaço dedicado às crianças com oficinas musicais, teatro e atividades temáticas.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '18 hours'
        );
        
        RAISE NOTICE 'Inseridas % novas notícias para o Festival de Forró!', 6;
    ELSE
        RAISE NOTICE 'Evento Festival de Forró não encontrado!';
    END IF;
END $$; 