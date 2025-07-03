// Script para executar migrations diretamente no PostgreSQL
// Portal de Eventos Garanhuns
// Conecta diretamente ao banco PostgreSQL do Supabase

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuração de conexão direta
const DATABASE_URL = 'postgresql://postgres.sxfybutceyadvuasoerp:RzCkPIgUziSyaZzB@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

console.log('🚀 Executando Migrations Diretas - Portal de Eventos');
console.log('=' .repeat(60));

// Lista de migrations em ordem
const migrations = [
  '001_create_enums.sql',
  '002_create_event_categories.sql', 
  '003_create_user_profiles.sql',
  '004_create_events.sql',
  '005_add_fixado_to_events.sql',
  '006_create_event_news.sql'
];

// Função para executar migration individual
async function executeMigration(client, filename) {
  try {
    const migrationPath = join('database', 'migrations', filename);
    const sql = readFileSync(migrationPath, 'utf8');
    
    console.log(`\n📋 Executando ${filename}...`);
    console.log(`   📊 Tamanho: ${(sql.length / 1024).toFixed(2)} KB`);
    
    // Limpar comentários e dividir em comandos
    const cleanSql = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim())
      .join('\n');
    
    // Executar o SQL completo
    await client.query(cleanSql);
    
    console.log(`   ✅ ${filename} executada com sucesso!`);
    return true;
    
  } catch (err) {
    console.log(`   ❌ Erro em ${filename}:`);
    console.log(`   💥 ${err.message}`);
    
    // Se o erro for de "already exists", consideramos como sucesso
    if (err.message.includes('already exists')) {
      console.log(`   ℹ️  Estrutura já existe - continuando...`);
      return true;
    }
    
    return false;
  }
}

// Função principal
async function runMigrations() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('🔗 Conectando ao banco PostgreSQL...');
    await client.connect();
    console.log('✅ Conexão estabelecida!');
    
    // Verificar informações do banco
    const versionResult = await client.query('SELECT version()');
    console.log(`🔧 PostgreSQL: ${versionResult.rows[0].version.split(' ')[1]}`);
    
    // Executar migrations
    let successCount = 0;
    const totalMigrations = migrations.length;
    
    for (const migration of migrations) {
      const success = await executeMigration(client, migration);
      if (success) {
        successCount++;
      } else {
        console.log(`❌ Parando devido a erro em ${migration}`);
        break;
      }
    }
    
    // Verificar estrutura criada
    console.log('\n🔍 Verificando estrutura criada...');
    
    const tablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`📋 Tabelas criadas: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name} (${row.table_type})`);
    });
    
    // Verificar enums
    const enumsResult = await client.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
      ORDER BY typname
    `);
    
    console.log(`\n🏷️  Enums criados: ${enumsResult.rows.length}`);
    enumsResult.rows.forEach(row => {
      console.log(`   - ${row.typname}`);
    });
    
    await client.end();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RESULTADO FINAL:');
    console.log('=' .repeat(60));
    console.log(`✅ Migrations executadas: ${successCount}/${totalMigrations}`);
    console.log(`📋 Tabelas criadas: ${tablesResult.rows.length}`);
    console.log(`🏷️  Enums criados: ${enumsResult.rows.length}`);
    
    if (successCount === totalMigrations) {
      console.log('\n🎉 SUCESSO! Banco configurado completamente!');
      console.log('✅ Pronto para popular com dados iniciais!');
      return true;
    } else {
      console.log('\n⚠️  Algumas migrations falharam.');
      return false;
    }
    
  } catch (err) {
    console.log(`💥 Erro fatal: ${err.message}`);
    if (client._connected) {
      await client.end();
    }
    return false;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('💥 Erro fatal:', err);
      process.exit(1);
    });
}

export { runMigrations }; 