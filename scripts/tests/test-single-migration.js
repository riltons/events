// Teste de migration individual
// Portal de Eventos Garanhuns

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';

const DATABASE_URL = 'postgresql://postgres.sxfybutceyadvuasoerp:RzCkPIgUziSyaZzB@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

console.log('🧪 Teste de Migration Individual');
console.log('=' .repeat(40));

async function testMigration() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('🔗 Conectando...');
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!');
    
    // Testar consulta simples
    const testResult = await client.query('SELECT current_database()');
    console.log('📊 Database:', testResult.rows[0].current_database);
    
    // Verificar se os enums já existem
    console.log('\n🔍 Verificando enums existentes...');
    const enumsResult = await client.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
      ORDER BY typname
    `);
    
    console.log(`📋 Enums encontrados: ${enumsResult.rows.length}`);
    enumsResult.rows.forEach(row => {
      console.log(`   - ${row.typname}`);
    });
    
    // Se não há enums, executar primeira migration
    if (enumsResult.rows.length === 0) {
      console.log('\n🚀 Executando primeira migration...');
      
      const enumsSql = `
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
);`;
      
      await client.query(enumsSql);
      console.log('✅ Enums criados com sucesso!');
      
      // Verificar novamente
      const newEnumsResult = await client.query(`
        SELECT typname 
        FROM pg_type 
        WHERE typtype = 'e' 
        ORDER BY typname
      `);
      
      console.log(`📋 Enums após criação: ${newEnumsResult.rows.length}`);
      newEnumsResult.rows.forEach(row => {
        console.log(`   - ${row.typname}`);
      });
    } else {
      console.log('ℹ️  Enums já existem!');
    }
    
    await client.end();
    console.log('\n✅ Teste concluído com sucesso!');
    
  } catch (err) {
    console.log('❌ Erro:', err.message);
    if (client._connected) {
      await client.end();
    }
  }
}

testMigration(); 