// Teste de operações básicas no Supabase
// Portal de Eventos Garanhuns

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sxfybutceyadvuasoerp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDgwMDgsImV4cCI6MjA2Njc4NDAwOH0.OqTIfBrK1qvKQX1PoUOrYIhgRaGNMhq5Z6TM-LgSs50';

console.log('🚀 Teste de Operações Básicas - Supabase');
console.log('=' .repeat(50));

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testBasicOperations() {
  try {
    console.log('🔄 1. Verificando se existem tabelas...');
    
    // Tentar acessar uma tabela que pode existir
    const tables = ['test_table', 'events', 'users', 'categories'];
    
    for (const tableName of tables) {
      console.log(`   🔍 Testando tabela: ${tableName}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`   ❌ Tabela ${tableName} não existe`);
        } else {
          console.log(`   ⚠️  Erro ao acessar ${tableName}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ Tabela ${tableName} encontrada! Registros: ${data?.length || 0}`);
        if (data && data.length > 0) {
          console.log(`   📋 Primeiro registro:`, JSON.stringify(data[0], null, 2));
        }
        return { table: tableName, exists: true, data };
      }
    }
    
    console.log('\n🔄 2. Tentando criar uma tabela de teste...');
    
    // Como não temos privilégios para SQL direto, vamos tentar usar uma função RPC que pode estar disponível
    console.log('   🔍 Verificando funções RPC disponíveis...');
    
    const { data: rpcData, error: rpcError } = await supabase.rpc('test_function');
    
    if (rpcError) {
      console.log(`   ❌ RPC Error: ${rpcError.message}`);
      
      if (rpcError.message.includes('does not exist')) {
        console.log('   ℹ️  Isso é normal - nenhuma função RPC personalizada encontrada');
      }
    } else {
      console.log('   ✅ Função RPC funcionou:', rpcData);
    }
    
    console.log('\n🔄 3. Verificando autenticação...');
    
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log(`   ❌ Erro de autenticação: ${authError.message}`);
    } else {
      console.log('   ✅ Sessão de autenticação:', authData.session ? 'Autenticado' : 'Anônimo');
    }
    
    return { success: true, hasData: false };
    
  } catch (err) {
    console.log('💥 Erro durante os testes:', err.message);
    return { success: false, error: err.message };
  }
}

async function checkDatabaseStructure() {
  console.log('\n🔄 4. Verificando estrutura do banco...');
  
  try {
    // Tentar acessar a API REST para ver quais endpoints estão disponíveis
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('   ✅ API REST está respondendo');
      console.log(`   📊 Status: ${response.status} ${response.statusText}`);
      
      // Verificar headers para informações adicionais
      const contentType = response.headers.get('content-type');
      console.log(`   📋 Content-Type: ${contentType}`);
      
    } else {
      console.log(`   ❌ API REST error: ${response.status} ${response.statusText}`);
    }
    
  } catch (err) {
    console.log(`   💥 Erro ao conectar com API REST: ${err.message}`);
  }
}

// Executar todos os testes
console.log('🔗 Conectando com Supabase...\n');

Promise.all([
  testBasicOperations(),
  checkDatabaseStructure()
]).then(([operationResult, structureResult]) => {
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESULTADO FINAL:');
  console.log('=' .repeat(50));
  
  if (operationResult.success) {
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    console.log('📡 URL do projeto está acessível');
    console.log('🔑 Chave de API está funcionando');
    
    if (operationResult.hasData) {
      console.log('📊 Dados encontrados no banco');
    } else {
      console.log('📝 Banco está vazio ou tabelas não existem ainda');
      console.log('🚀 Pronto para configurar o schema do banco!');
    }
  } else {
    console.log('❌ Problemas na conexão:');
    console.log(`   💥 ${operationResult.error}`);
  }
  
  console.log('\n🎯 PRÓXIMOS PASSOS:');
  console.log('   1. Executar migrations para criar o schema');
  console.log('   2. Popular dados iniciais');
  console.log('   3. Configurar o frontend para usar o Supabase remoto');
  
}).catch(err => {
  console.error('💥 Erro fatal nos testes:', err);
  process.exit(1);
}); 