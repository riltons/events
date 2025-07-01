// Script de Teste de Conexão PostgreSQL
// Portal de Eventos Garanhuns

import { Client } from 'pg';

// Configurações do banco local
const config = {
  host: 'localhost',
  port: 5432,
  database: 'eventos_garanhuns_dev',
  user: 'postgres',
  password: 'postgres123',
};

async function testConnection() {
  const client = new Client(config);
  
  try {
    console.log('🔄 Testando conexão com PostgreSQL...');
    console.log(`📡 Host: ${config.host}:${config.port}`);
    console.log(`🗃️  Database: ${config.database}`);
    console.log(`👤 Usuário: ${config.user}`);
    
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query simples
    const result = await client.query('SELECT NOW() as timestamp, version() as version');
    console.log('⏰ Timestamp:', result.rows[0].timestamp);
    console.log('🐘 PostgreSQL:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    
    // Verificar tabelas criadas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tabelas encontradas:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Verificar categorias
    const categories = await client.query('SELECT COUNT(*) as total FROM event_categories');
    console.log(`\n🏷️  Categorias de eventos: ${categories.rows[0].total}`);
    
    // Verificar eventos
    const events = await client.query('SELECT COUNT(*) as total FROM events');
    console.log(`🎉 Eventos cadastrados: ${events.rows[0].total}`);
    
    // Verificar usuários
    const users = await client.query('SELECT COUNT(*) as total FROM user_profiles');
    console.log(`👥 Usuários cadastrados: ${users.rows[0].total}`);
    
    console.log('\n🎊 Teste de conexão concluído com sucesso!');
    console.log('🔗 String de conexão funcionando: postgresql://postgres:postgres123@localhost:5432/eventos_garanhuns_dev');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Dica: PostgreSQL pode não estar rodando. Verifique o serviço.');
    } else if (error.code === '28P01') {
      console.log('💡 Dica: Senha incorreta. Verifique as credenciais.');
    } else if (error.code === '3D000') {
      console.log('💡 Dica: Database não existe. Execute o script de setup primeiro.');
    }
  } finally {
    await client.end();
  }
}

// Executar teste
testConnection(); 