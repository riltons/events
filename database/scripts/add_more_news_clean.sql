-- Script para adicionar mais noticias ao Festival de Forro de Garanhuns 2025
-- Portal de Eventos Garanhuns

-- Inserir 6 noticias adicionais para o Festival de Forro
DO $$
DECLARE 
    festival_id UUID;
BEGIN
    -- Buscar o ID do Festival de Forro
    SELECT id INTO festival_id 
    FROM events 
    WHERE slug = 'festival-forro-garanhuns-2025' 
    LIMIT 1;
    
    -- Se encontrar o evento, inserir as novas noticias
    IF festival_id IS NOT NULL THEN
        INSERT INTO event_news (event_id, title, slug, content, summary, is_published, is_featured, published_at) VALUES
        (
            festival_id,
            'Estrutura completa montada no Parque Ruber van der Linden',
            'estrutura-completa-montada-parque-ruber',
            'A montagem da estrutura do Festival de Forro 2025 foi concluida no Parque Ruber van der Linden. Sao mais de 20 mil metros quadrados de area com palco principal de 800m2, area VIP climatizada, praca de alimentacao com 40 estandes e estacionamento para 2 mil veiculos.',
            'Montagem finalizada com palco principal, area VIP e infraestrutura completa para o maior festival da regiao.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '30 minutes'
        ),
        (
            festival_id,
            'Transporte publico gratuito sera oferecido durante o festival',
            'transporte-publico-gratuito-festival-forro',
            'A Prefeitura de Garanhuns anuncia que havera transporte publico gratuito durante os tres dias do Festival de Forro 2025. Onibus especiais farao o trajeto dos principais bairros da cidade ate o Parque Ruber van der Linden, funcionando das 17h as 2h da manha.',
            'Onibus gratuitos conectarao toda a cidade ao local do festival nos tres dias de evento.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '2 hours'
        ),
        (
            festival_id,
            'Elba Ramalho confirma repertorio especial para Garanhuns',
            'elba-ramalho-repertorio-especial-garanhuns',
            'A cantora Elba Ramalho, uma das principais atracoes do Festival de Forro 2025, confirmou que preparou um repertorio especial para o publico de Garanhuns. Alem dos sucessos como Chao de Giz e Bate Coracao, ela interpretara classicos do forro pe-de-serra.',
            'Rainha do forro prepara show especial com classicos e homenagem a Luiz Gonzaga.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '4 hours'
        ),
        (
            festival_id,
            'Concurso de quadrilhas juninas tera premiacao de R$ 15 mil',
            'concurso-quadrilhas-premiacao-15-mil',
            'O Festival de Forro 2025 realizara o maior concurso de quadrilhas juninas da regiao, com premiacao total de R$ 15 mil. As inscricoes estao abertas ate quinta-feira para grupos de toda a microrregiao.',
            'Maior concurso de quadrilhas da regiao com R$ 15 mil em premios para os participantes.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '8 hours'
        ),
        (
            festival_id,
            'Alceu Valenca fara participacao especial no show de abertura',
            'alceu-valenca-participacao-especial-abertura',
            'O cantor e compositor Alceu Valenca fara uma participacao especial no show de abertura do Festival de Forro 2025. O artista, que e natural de Sao Bento do Una, subira ao palco para interpretar seus classicos como Anunciacao e Tropicana.',
            'Icone da musica pernambucana abre o festival com classicos e dueto especial.',
            TRUE,
            TRUE,
            NOW() - INTERVAL '12 hours'
        ),
        (
            festival_id,
            'Festival tera area kids com oficinas e apresentacoes especiais',
            'area-kids-oficinas-apresentacoes-especiais',
            'O Festival de Forro 2025 contara com uma area kids completamente estruturada, com oficinas de sanfona, zabumba e triangulo para criancas de 6 a 14 anos. Havera tambem apresentacoes de teatro de bonecos contando a historia do forro.',
            'Espaco dedicado as criancas com oficinas musicais, teatro e atividades tematicas.',
            TRUE,
            FALSE,
            NOW() - INTERVAL '18 hours'
        );
        
        RAISE NOTICE 'Inseridas 6 novas noticias para o Festival de Forro!';
    ELSE
        RAISE NOTICE 'Evento Festival de Forro nao encontrado!';
    END IF;
END $$; 