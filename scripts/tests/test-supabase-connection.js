// Script para testar conexão com Supabase Remoto
// Portal de Eventos Garanhuns

import { createClient } from '@supabase/supabase-js';
import pkg from 'pg';
const { Client } = pkg;

// Importar configurações
import { SUPABASE_CONFIG, DATABASE_URL } from './supabase-config.js';

console.log('🔄 Testando conexão com Supabase Remoto...\n');

// Teste 1: Conexão via Supabase Client
async function testSupabaseClient() {
  console.log('📡 1. Testando Supabase Client API...');
  
  try {
    const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    
    // Teste simples: buscar tabelas
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (error) {
      console.log('❌ Erro na conexão Supabase Client:', error.message);
      return false;
    }
    
    console.log('✅ Supabase Client conectado com sucesso!');
    console.log('📋 Tabelas encontradas:', data.map(t => t.table_name).join(', '));
    return true;
    
  } catch (err) {
    console.log('❌ Erro no Supabase Client:', err.message);
    return false;
  }
}

// Teste 2: Conexão direta com PostgreSQL
async function testDirectConnection() {
  console.log('\n🗄️  2. Testando conexão direta PostgreSQL...');
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Conexão PostgreSQL estabelecida!');
    
    // Verificar informações do banco
    const versionResult = await client.query('SELECT version()');
    console.log('🔧 Versão do PostgreSQL:', versionResult.rows[0].version.split(' ')[1]);
    
    // Verificar tabelas existentes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas no banco:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Verificar se há dados nas tabelas principais
    const mainTables = ['users', 'events', 'event_categories'];
    
    for (const table of mainTables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`📊 Registros em ${table}: ${countResult.rows[0].count}`);
      } catch (err) {
        console.log(`⚠️  Tabela ${table} não encontrada ou erro: ${err.message}`);
      }
    }
    
    await client.end();
    return true;
    
  } catch (err) {
    console.log('❌ Erro na conexão PostgreSQL:', err.message);
    if (client._connected) {
      await client.end();
    }
    return false;
  }
}

// Teste 3: Verificar autenticação
async function testAuthentication() {
  console.log('\n🔐 3. Testando autenticação Supabase...');
  
  try {
    const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceRoleKey);
    
    // Tentar uma operação que requer service role
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Erro na autenticação:', error.message);
      return false;
    }
    
    console.log('✅ Autenticação service role funcionando!');
    console.log(`👥 Usuários no sistema: ${data.users?.length || 0}`);
    return true;
    
  } catch (err) {
    console.log('❌ Erro na autenticação:', err.message);
    return false;
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Portal de Eventos Garanhuns - Teste de Conexão Supabase');
  console.log('=' .repeat(60));
  console.log(`📡 URL: ${SUPABASE_CONFIG.url}`);
  console.log(`🔑 Project ID: ${SUPABASE_CONFIG.projectId}`);
  console.log('=' .repeat(60));
  
  const results = {
    supabaseClient: await testSupabaseClient(),
    directConnection: await testDirectConnection(),
    authentication: await testAuthentication()
  };
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESULTADO DOS TESTES:');
  console.log('=' .repeat(60));
  console.log(`📡 Supabase Client: ${results.supabaseClient ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`🗄️  PostgreSQL Direto: ${results.directConnection ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`🔐 Autenticação: ${results.authentication ? '✅ OK' : '❌ FALHOU'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 SUCESSO! Todas as conexões estão funcionando!');
    console.log('✅ Supabase remoto configurado e pronto para uso!');
  } else {
    console.log('\n⚠️  ATENÇÃO! Alguns testes falharam.');
    console.log('🔧 Verifique as configurações e credenciais.');
  }
  
  return allPassed;
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('💥 Erro fatal:', err);
      process.exit(1);
    });
}

export { runAllTests, testSupabaseClient, testDirectConnection, testAuthentication }; 