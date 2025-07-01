// Script para Criar Dados de Exemplo
// Portal de Eventos Garanhuns

import { Client } from 'pg';

const config = {
  host: 'localhost',
  port: 5432,
  database: 'eventos_garanhuns_dev',
  user: 'postgres',
  password: 'postgres123',
};

async function createSampleData() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco de dados');
    
    // 1. Criar usuários de exemplo
    console.log('\n👥 Criando usuários de exemplo...');
    
    const users = [
      {
        email: 'admin@garanhuns.pe.gov.br',
        name: 'Administrador Portal',
        type: 'master'
      },
      {
        email: 'organizador@garanhuns.pe.gov.br', 
        name: 'João Organizador',
        type: 'event_creator'
      },
      {
        email: 'usuario@garanhuns.pe.gov.br',
        name: 'Maria Silva',
        type: 'end_user'
      }
    ];
    
    for (const user of users) {
      const userResult = await client.query(`
        INSERT INTO auth.users (email, raw_user_meta_data) 
        VALUES ($1, $2)
        ON CONFLICT (email) DO UPDATE SET raw_user_meta_data = $2
        RETURNING id
      `, [user.email, JSON.stringify({ full_name: user.name })]);
      
      if (userResult.rows.length > 0) {
        await client.query(`
          INSERT INTO user_profiles (id, full_name, username, user_type, email_verified, profile_completed) 
          VALUES ($1, $2, $3, $4, true, true)
          ON CONFLICT (id) DO UPDATE SET 
            full_name = $2, username = $3, user_type = $4, 
            email_verified = true, profile_completed = true
        `, [
          userResult.rows[0].id,
          user.name,
          user.email.split('@')[0],
          user.type
        ]);
        
        console.log(`✅ ${user.name} (${user.type})`);
      }
    }
    
    // 2. Buscar IDs das categorias
    const categories = await client.query('SELECT id, slug FROM event_categories WHERE parent_id IS NULL');
    const categoryMap = {};
    categories.rows.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    // 3. Buscar ID do usuário organizador
    const organizerResult = await client.query(`
      SELECT u.id FROM auth.users u 
      JOIN user_profiles p ON u.id = p.id 
      WHERE u.email = 'organizador@garanhuns.pe.gov.br'
    `);
    const organizerId = organizerResult.rows[0].id;
    
    // 4. Criar eventos de exemplo
    console.log('\n🎉 Criando eventos de exemplo...');
    
    const events = [
      {
        title: 'Festival de Forró de Garanhuns 2025',
        slug: 'festival-forro-garanhuns-2025',
        description: 'O maior festival de forró do agreste pernambucano retorna com grandes atrações nacionais e regionais.',
        short_description: 'Festival de forró com grandes atrações musicais',
        event_type: 'musical',
        category_id: categoryMap['forro'] || categoryMap['musical'],
        start_date: '2025-07-15 19:00:00-03',
        end_date: '2025-07-20 23:00:00-03',
        venue_name: 'Parque Ruber van der Linden',
        is_featured: true,
        is_free: true,
        status: 'published'
      },
      {
        title: 'Festa Junina da Praça',
        slug: 'festa-junina-praca-2025',
        description: 'Tradicional festa junina com quadrilhas, forró pé de serra e comidas típicas.',
        short_description: 'Festa junina tradicional com muita animação',
        event_type: 'cultural',
        category_id: categoryMap['cultural'],
        start_date: '2025-06-24 18:00:00-03',
        end_date: '2025-06-24 23:00:00-03',
        venue_name: 'Praça Souto Filho',
        is_featured: true,
        is_free: true,
        status: 'published'
      },
      {
        title: 'Workshop de Empreendedorismo',
        slug: 'workshop-empreendedorismo-2025',
        description: 'Workshop gratuito sobre empreendedorismo para jovens de Garanhuns.',
        short_description: 'Capacitação em empreendedorismo para jovens',
        event_type: 'educational',
        category_id: categoryMap['educacional'],
        start_date: '2025-07-10 14:00:00-03',
        end_date: '2025-07-10 18:00:00-03',
        venue_name: 'Centro de Convenções',
        is_featured: false,
        is_free: true,
        status: 'published'
      },
      {
        title: 'Show Gospel na Praça',
        slug: 'show-gospel-praca-2025',
        description: 'Grande show gospel com artistas locais e regionais.',
        short_description: 'Show gospel com grandes nomes da música cristã',
        event_type: 'musical',
        category_id: categoryMap['gospel'],
        start_date: '2025-08-15 19:00:00-03',
        end_date: '2025-08-15 22:00:00-03',
        venue_name: 'Praça Souto Filho',
        is_featured: false,
        is_free: true,
        status: 'published'
      }
    ];
    
    for (const event of events) {
      await client.query(`
        INSERT INTO events (
          title, slug, description, short_description, event_type, category_id,
          created_by, start_date, end_date, venue_name, is_featured, is_free, status,
          created_at, updated_at, published_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW(), NOW()
        ) ON CONFLICT (slug) DO UPDATE SET
          title = $1, description = $3, short_description = $4, updated_at = NOW()
      `, [
        event.title, event.slug, event.description, event.short_description,
        event.event_type, event.category_id, organizerId, event.start_date,
        event.end_date, event.venue_name, event.is_featured, event.is_free, event.status
      ]);
      
      console.log(`✅ ${event.title}`);
    }
    
    // 5. Verificar dados criados
    console.log('\n📊 Resumo dos dados criados:');
    
    const userCount = await client.query('SELECT COUNT(*) FROM user_profiles');
    const eventCount = await client.query('SELECT COUNT(*) FROM events');
    const categoryCount = await client.query('SELECT COUNT(*) FROM event_categories');
    
    console.log(`👥 Usuários: ${userCount.rows[0].count}`);
    console.log(`🎉 Eventos: ${eventCount.rows[0].count}`);
    console.log(`🏷️ Categorias: ${categoryCount.rows[0].count}`);
    
    console.log('\n🎊 Dados de exemplo criados com sucesso!');
    console.log('🌐 Agora você pode desenvolver o frontend com dados reais!');
    
  } catch (error) {
    console.error('❌ Erro ao criar dados de exemplo:', error);
  } finally {
    await client.end();
  }
}

createSampleData(); 