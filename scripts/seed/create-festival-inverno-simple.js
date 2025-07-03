// Script simplificado para criar o Festival de Inverno de Garanhuns 2025
// Portal de Eventos Garanhuns

import { Client } from 'pg';

const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'eventos_garanhuns_dev',
  user: 'postgres',
  password: 'postgres123',
};

async function connectDB() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

async function createFestivalInverno2025() {
  const client = await connectDB();
  
  try {
    console.log('🎭 Criando Festival de Inverno de Garanhuns 2025...');
    
    // 1. Desfixar eventos anteriores
    await client.query('UPDATE events SET fixado = FALSE WHERE fixado = TRUE');
    console.log('✅ Eventos anteriores desfixados');
    
    // 2. Buscar categoria Cultural
    const categoryResult = await client.query(
      "SELECT id FROM event_categories WHERE slug = 'cultural' LIMIT 1"
    );
    
    if (categoryResult.rows.length === 0) {
      throw new Error('Categoria "cultural" não encontrada');
    }
    
    const categoryId = categoryResult.rows[0].id;
    console.log('✅ Categoria Cultural encontrada:', categoryId);
    
    // 3. Buscar um usuário existente ou usar UUID direto
    let userId;
    const userResult = await client.query(
      "SELECT id FROM user_profiles LIMIT 1"
    );
    
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
    } else {
      // Inserir usuário sistema se não existir nenhum
      const userInsert = await client.query(`
        INSERT INTO user_profiles (full_name, email, user_type, is_verified, created_at)
        VALUES ('Sistema Garanhuns', 'sistema@garanhuns.pe.gov.br', 'master', true, NOW())
        RETURNING id
      `);
      userId = userInsert.rows[0].id;
    }
    
    console.log('✅ Usuário encontrado/criado:', userId);
    
    // 4. Inserir o evento
    const eventInsert = await client.query(`
      INSERT INTO events (
        title,
        slug,
        description,
        short_description,
        event_type,
        category_id,
        created_by,
        status,
        is_featured,
        is_official,
        fixado,
        start_date,
        end_date,
        venue_name,
        is_free,
        published_at,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW(), NOW()
      ) RETURNING id
    `, [
      '33º Festival de Inverno de Garanhuns 2025 - 35 Anos',
      'festival-inverno-garanhuns-2025',
      'O 33º Festival de Inverno de Garanhuns celebra 35 anos do maior festival multicultural da América Latina. De 10 a 27 de julho de 2025, Garanhuns se transforma no epicentro da cultura brasileira com mais de 20 polos culturais espalhados pela cidade. Esta edição especial presta homenagem ao mestre da xilogravura J. Borges, artista pernambucano reconhecido como Patrimônio Vivo de Pernambuco.',
      'O maior festival multicultural da América Latina completa 35 anos! De 10 a 27 de julho, mais de 20 polos culturais com música, teatro, circo, cultura popular e gastronomia. Homenagem especial ao mestre J. Borges.',
      'festival',
      categoryId,
      userId,
      'published',
      true,  // is_featured
      true,  // is_official
      true,  // fixado
      '2025-07-10 19:00:00-03',
      '2025-07-27 23:59:00-03',
      'Centro Histórico de Garanhuns + 20 Polos Culturais',
      true   // is_free
    ]);
    
    const eventId = eventInsert.rows[0].id;
    console.log(`✅ Evento criado com ID: ${eventId}`);
    
    // 5. Criar algumas notícias principais
    const noticias = [
      {
        titulo: 'Festival de Inverno de Garanhuns 2025 é lançado com homenagem a J. Borges',
        slug: 'festival-inverno-garanhuns-2025-lancado-homenagem-j-borges',
        conteudo: 'A Prefeitura de Garanhuns lançou oficialmente a 33ª edição do Festival de Inverno de Garanhuns, que celebra 35 anos do maior festival multicultural da América Latina. Esta edição presta homenagem ao mestre da xilogravura J. Borges, artista pernambucano reconhecido como Patrimônio Vivo de Pernambuco.',
        resumo: 'Prefeitura anuncia 33ª edição do FIG com homenagem especial ao mestre da xilogravura J. Borges.',
        destaque: true
      },
      {
        titulo: 'Programação do FIG 2025 traz grandes nomes da música nacional',
        slug: 'programacao-fig-2025-grandes-nomes-musica-nacional',
        conteudo: 'O Festival de Inverno de Garanhuns 2025 confirmou uma programação impressionante com artistas como Elba Ramalho, Alceu Valença, Geraldo Azevedo, Ana Carolina, Iza, Joelma e muitos outros. Mais de 20 polos culturais movimentarão a cidade durante 18 dias.',
        resumo: 'FIG 2025 confirma lineup com grandes nomes da música nacional em mais de 20 polos culturais.',
        destaque: true
      },
      {
        titulo: 'J. Borges: conheça o mestre da xilogravura homenageado no FIG 2025',
        slug: 'j-borges-mestre-xilogravura-homenageado-fig-2025',
        conteudo: 'José Francisco Borges, conhecido como J. Borges, nasceu em 1935 em Bezerros, Pernambuco. Considerado o maior xilógrafo do Nordeste brasileiro, faleceu em 2024 deixando um legado inestimável para a cultura popular brasileira. Sua obra retrata o cotidiano nordestino com maestria.',
        resumo: 'Conheça a trajetória inspiradora de J. Borges, maior xilógrafo do Nordeste e homenageado do FIG 2025.',
        destaque: false
      },
      {
        titulo: 'FIG 2025 oferece oficinas gratuitas de arte e cultura',
        slug: 'fig-2025-oficinas-gratuitas-arte-cultura',
        conteudo: 'A Casa dos Saberes oferecerá oficinas gratuitas de música, audiovisual, gastronomia, xilogravura e artesanato durante o Festival de Inverno 2025. As atividades são abertas ao público e visam democratizar o acesso à cultura.',
        resumo: 'Casa dos Saberes oferece formação cultural gratuita durante o festival.',
        destaque: false
      },
      {
        titulo: 'Cortejos populares animam as ruas de Garanhuns no FIG 2025',
        slug: 'cortejos-populares-animam-ruas-garanhuns-fig-2025',
        conteudo: 'Boi da Macuca, Bloco da Saudade, Maracatu Leão Vencedor de Carpina e outras manifestações populares animarão as tardes do festival com cortejos que saem do Relógio de Flores em direção ao Parque Euclides Dourado.',
        resumo: 'Manifestações populares tradicionais ganham as ruas com cortejos culturais.',
        destaque: false
      }
    ];
    
    console.log('📰 Criando notícias...');
    
    for (const noticia of noticias) {
      await client.query(`
        INSERT INTO event_news (
          event_id,
          title,
          slug,
          content,
          summary,
          author_name,
          is_published,
          is_featured,
          published_at,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), NOW())
      `, [
        eventId,
        noticia.titulo,
        noticia.slug,
        noticia.conteudo,
        noticia.resumo,
        'Secretaria de Cultura de Garanhuns',
        true,
        noticia.destaque
      ]);
      
      console.log(`✅ Notícia criada: ${noticia.titulo}`);
    }
    
    console.log('\n🎉 Festival de Inverno de Garanhuns 2025 criado com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   - Evento principal fixado: ✅`);
    console.log(`   - Evento ID: ${eventId}`);
    console.log(`   - Notícias criadas: ${noticias.length}`);
    console.log(`   - Período: 10 a 27 de julho de 2025`);
    console.log(`   - Homenageado: J. Borges`);
    console.log('\n🔗 Acesse: http://localhost:5173');
    
  } catch (error) {
    console.error('❌ Erro ao criar Festival de Inverno 2025:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Executar script
createFestivalInverno2025().catch(console.error); 