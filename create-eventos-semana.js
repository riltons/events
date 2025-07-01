// Script para criar eventos da semana
// Portal de Eventos Garanhuns

import { Client } from 'pg';

const config = {
  host: 'localhost',
  port: 5432,
  database: 'eventos_garanhuns_dev',
  user: 'postgres',
  password: 'postgres123',
};

async function criarEventosSemana() {
  const client = new Client(config);
  
  try {
    console.log('🔄 Conectando ao banco PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');

    // Primeiro, vamos buscar os IDs necessários
    console.log('🔍 Buscando categorias e usuários...');
    
    const categoriasResult = await client.query(`
      SELECT id, slug FROM event_categories 
      WHERE slug IN ('forro', 'religioso', 'cultural', 'gastronomico', 'gospel')
    `);
    
    const categorias = {};
    categoriasResult.rows.forEach(row => {
      categorias[row.slug] = row.id;
    });
    
    console.log('📋 Categorias encontradas:', Object.keys(categorias));
    
    // Buscar usuário criador
    const usuarioResult = await client.query('SELECT id FROM user_profiles LIMIT 1');
    let usuarioId;
    
    if (usuarioResult.rows.length > 0) {
      usuarioId = usuarioResult.rows[0].id;
      console.log('👤 Usuário encontrado:', usuarioId);
    } else {
      console.log('👤 Criando usuário administrador...');
      const newUserResult = await client.query(`
        INSERT INTO auth.users (id, email, created_at) 
        VALUES (gen_random_uuid(), 'admin@eventosgaranhuns.com.br', NOW())
        RETURNING id
      `);
      usuarioId = newUserResult.rows[0].id;
      
      await client.query(`
        INSERT INTO user_profiles (id, full_name, user_type, status)
        VALUES ($1, 'Administrador Portal', 'event_admin', 'active')
      `, [usuarioId]);
    }

    console.log('🎉 Criando eventos da semana...');

    // Evento 1: Show de Forró - Quarta-feira
    await client.query(`
      INSERT INTO events (
        title, slug, description, short_description, event_type, category_id, created_by,
        status, is_featured, is_official, start_date, end_date, venue_name, address,
        is_free, contact_info, organizer_info, banner_image, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `, [
      'Forró do Meio da Semana - Wesley Safadão',
      'forro-meio-semana-wesley-safadao',
      'Uma noite especial com o rei do forró Wesley Safadão no coração de Garanhuns. Venha dançar e se divertir com os maiores sucessos do forró brasileiro!',
      'Wesley Safadão em Garanhuns! Uma noite inesquecível de forró no meio da semana.',
      'musical',
      categorias.forro,
      usuarioId,
      'published',
      true,
      false,
      '2025-01-29 20:00:00-03',
      '2025-01-30 02:00:00-03',
      'Pátio de Eventos de Garanhuns',
      JSON.stringify({"street": "Av. Ruber van der Linden", "number": "s/n", "neighborhood": "Heliópolis", "city": "Garanhuns", "state": "PE", "zip_code": "55295-000"}),
      false,
      JSON.stringify({"phone": "+55 87 99999-1234", "email": "eventos@patiogaranhuns.com.br", "whatsapp": "+55 87 99999-1234"}),
      JSON.stringify({"name": "Pátio de Eventos", "description": "O melhor espaço para eventos de Garanhuns"}),
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
      ['forró', 'wesley safadão', 'música', 'dança', 'garanhuns']
    ]);
    console.log('✅ Evento 1 criado: Forró Wesley Safadão');

    // Evento 2: Culto Especial - Quarta-feira
    await client.query(`
      INSERT INTO events (
        title, slug, description, short_description, event_type, category_id, created_by,
        status, is_featured, is_official, start_date, end_date, venue_name, address,
        is_free, contact_info, organizer_info, banner_image, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `, [
      'Culto de Gratidão e Bênçãos',
      'culto-gratidao-bencaos',
      'Um culto especial de gratidão pelos primeiros dias do ano. Venha louvar e agradecer as bênçãos recebidas em comunidade. Haverá oração especial e ministração da palavra.',
      'Culto especial de gratidão. Venha dar graças pelas bênçãos do ano que começou.',
      'religious',
      categorias.religioso,
      usuarioId,
      'published',
      false,
      true,
      '2025-01-29 19:30:00-03',
      '2025-01-29 21:30:00-03',
      'Igreja Matriz de Santo Antônio',
      JSON.stringify({"street": "Praça Mestre Dominguinhos", "number": "s/n", "neighborhood": "Centro", "city": "Garanhuns", "state": "PE", "zip_code": "55295-000"}),
      true,
      JSON.stringify({"phone": "+55 87 3761-2345", "email": "matriz@garanhuns.org.br"}),
      JSON.stringify({"name": "Paróquia de Santo Antônio", "description": "Igreja Matriz de Garanhuns"}),
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=400&fit=crop',
      ['religioso', 'culto', 'gratidão', 'bênçãos', 'igreja', 'católico']
    ]);
    console.log('✅ Evento 2 criado: Culto de Gratidão');

    // Evento 3: Peça Teatral - Sexta-feira
    await client.query(`
      INSERT INTO events (
        title, slug, description, short_description, event_type, category_id, created_by,
        status, is_featured, is_official, start_date, end_date, venue_name, address,
        is_free, contact_info, organizer_info, banner_image, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `, [
      'Auto da Compadecida - Grupo Teatral Sertão',
      'auto-compadecida-grupo-sertao',
      'O clássico de Ariano Suassuna ganha vida no palco com o renomado Grupo Teatral Sertão. Uma apresentação emocionante que retrata a cultura nordestina com humor e poesia.',
      'O Auto da Compadecida em uma apresentação única do Grupo Teatral Sertão.',
      'cultural',
      categorias.cultural,
      usuarioId,
      'published',
      true,
      true,
      '2025-01-31 20:00:00-03',
      '2025-01-31 22:00:00-03',
      'Teatro Guarany',
      JSON.stringify({"street": "Rua Vigário Freire", "number": "134", "neighborhood": "Centro", "city": "Garanhuns", "state": "PE", "zip_code": "55295-000"}),
      false,
      JSON.stringify({"phone": "+55 87 3761-5678", "email": "teatroguarany@cultura.pe.gov.br"}),
      JSON.stringify({"name": "Secretaria de Cultura de Garanhuns", "description": "Órgão municipal responsável pela cultura"}),
      'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&h=400&fit=crop',
      ['teatro', 'auto da compadecida', 'ariano suassuna', 'cultura nordestina', 'literatura']
    ]);
    console.log('✅ Evento 3 criado: Auto da Compadecida');

    // Evento 4: Festival Gastronômico - Sábado
    await client.query(`
      INSERT INTO events (
        title, slug, description, short_description, event_type, category_id, created_by,
        status, is_featured, is_official, start_date, end_date, venue_name, address,
        is_free, contact_info, organizer_info, banner_image, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `, [
      'Festival de Sabores do Agreste',
      'festival-sabores-agreste',
      'Um festival gastronômico celebrando os sabores únicos do agreste pernambucano. Pratos típicos, food trucks, oficinas culinárias e muita diversão para toda a família.',
      'Festival gastronômico com os melhores sabores do agreste. Comida boa e diversão garantida!',
      'gastronomic',
      categorias.gastronomico,
      usuarioId,
      'published',
      true,
      true,
      '2025-02-01 17:00:00-03',
      '2025-02-01 23:00:00-03',
      'Praça Tavares Correia',
      JSON.stringify({"street": "Praça Tavares Correia", "number": "s/n", "neighborhood": "Centro", "city": "Garanhuns", "state": "PE", "zip_code": "55295-000"}),
      true,
      JSON.stringify({"phone": "+55 87 3761-9999", "email": "turismo@garanhuns.pe.gov.br"}),
      JSON.stringify({"name": "Secretaria de Turismo", "description": "Promovendo o turismo gastronômico em Garanhuns"}),
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
      ['gastronomia', 'festival', 'comida regional', 'food truck', 'agreste']
    ]);
    console.log('✅ Evento 4 criado: Festival Gastronômico');

    // Evento 5: Show Gospel - Domingo
    await client.query(`
      INSERT INTO events (
        title, slug, description, short_description, event_type, category_id, created_by,
        status, is_featured, is_official, start_date, end_date, venue_name, address,
        is_free, contact_info, organizer_info, banner_image, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `, [
      'Domingo de Louvor com Aline Barros',
      'domingo-louvor-aline-barros',
      'Um domingo especial de louvor e adoração com a cantora Aline Barros. Um momento de renovação espiritual para toda a família cristã de Garanhuns e região.',
      'Aline Barros em Garanhuns! Domingo de louvor e adoração para toda a família.',
      'religious',
      categorias.gospel,
      usuarioId,
      'published',
      true,
      false,
      '2025-02-02 16:00:00-03',
      '2025-02-02 19:00:00-03',
      'Arena Garanhuns',
      JSON.stringify({"street": "BR-423", "number": "Km 12", "neighborhood": "Mundo Novo", "city": "Garanhuns", "state": "PE", "zip_code": "55295-000"}),
      true,
      JSON.stringify({"phone": "+55 87 99988-7766", "email": "eventos@arenagaranhuns.com.br"}),
      JSON.stringify({"name": "Arena Garanhuns", "description": "Espaço multiuso para grandes eventos"}),
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop',
      ['gospel', 'aline barros', 'louvor', 'adoração', 'família', 'música cristã']
    ]);
    console.log('✅ Evento 5 criado: Show Gospel Aline Barros');

    // Evento 6: Roda de Samba - Sábado
    await client.query(`
      INSERT INTO events (
        title, slug, description, short_description, event_type, category_id, created_by,
        status, is_featured, is_official, start_date, end_date, venue_name, address,
        is_free, contact_info, organizer_info, banner_image, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `, [
      'Samba de Garanhuns - Roda de Samba',
      'samba-garanhuns-roda',
      'Uma autêntica roda de samba no coração de Garanhuns. Venha curtir os clássicos do samba e descobrir novos talentos locais. Ambiente descontraído e familiar.',
      'Roda de samba autêntica em Garanhuns. Boa música e ambiente familiar.',
      'musical',
      categorias.forro, // Usando categoria musical (forró tem parent musical)
      usuarioId,
      'published',
      false,
      false,
      '2025-02-01 21:00:00-03',
      '2025-02-02 01:00:00-03',
      'Bar do Zé - Centro Cultural',
      JSON.stringify({"street": "Rua Quinze de Novembro", "number": "789", "neighborhood": "Centro", "city": "Garanhuns", "state": "PE", "zip_code": "55295-000"}),
      false,
      JSON.stringify({"phone": "+55 87 99876-5432", "email": "bardoze@garanhuns.com.br"}),
      JSON.stringify({"name": "Bar do Zé", "description": "Tradicional casa de shows de Garanhuns"}),
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
      ['samba', 'roda de samba', 'música brasileira', 'cultura', 'bar']
    ]);
    console.log('✅ Evento 6 criado: Roda de Samba');

    // Verificar quantos eventos foram criados
    const totalEventos = await client.query('SELECT COUNT(*) as total FROM events');
    console.log(`\n🎊 Total de eventos no banco: ${totalEventos.rows[0].total}`);

    // Mostrar eventos da semana criados
    const eventosSemana = await client.query(`
      SELECT title, start_date, venue_name 
      FROM events 
      WHERE start_date >= '2025-01-29' AND start_date <= '2025-02-02'
      ORDER BY start_date
    `);

    console.log('\n📅 Eventos da semana criados:');
    eventosSemana.rows.forEach(evento => {
      const data = new Date(evento.start_date).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      console.log(`   📍 ${evento.title} - ${data} - ${evento.venue_name}`);
    });

    console.log('\n🎉 Eventos da semana criados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar eventos:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

// Executar
criarEventosSemana(); 