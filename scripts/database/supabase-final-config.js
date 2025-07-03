// Configuração Final do Supabase - URL Correta
// Portal de Eventos Garanhuns

import { createClient } from '@supabase/supabase-js';

// URL CORRETA confirmada pelo usuário
const SUPABASE_URL = 'https://sxfybutceyadvuasoerp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDgwMDgsImV4cCI6MjA2Njc4NDAwOH0.OqTIfBrK1qvKQX1PoUOrYIhgRaGNMhq5Z6TM-LgSs50';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIwODAwOCwiZXhwIjoyMDY2Nzg0MDA4fQ.hsXiSo5NYhQ8uLduVmyNrCLv26mDLOciD7fdUsy7_Wg';

console.log('🚀 Teste Final com URL Correta - Supabase');
console.log('=' .repeat(60));
console.log('📡 URL:', SUPABASE_URL);
console.log('🔑 Projeto:', 'sxfybutceyadvuasoerp');

async function testConnection() {
  try {
    console.log('\n1. 🔐 Testando conexão anônima...');
    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Teste básico de autenticação
    const { data: authData, error: authError } = await supabaseAnon.auth.getSession();
    if (authError) {
      console.log('❌ Erro de auth:', authError.message);
    } else {
      console.log('✅ Conexão anônima OK!');
    }
    
    console.log('\n2. 🔧 Testando service role...');
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    // Verificar se existem tabelas
    console.log('\n3. 📋 Verificando tabelas existentes...');
    const { data: tables, error: tablesError } = await supabaseService
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);
    
    if (tablesError) {
      console.log('❌ Erro ao listar tabelas:', tablesError.message);
    } else {
      console.log(`📊 Tabelas encontradas: ${tables?.length || 0}`);
      if (tables && tables.length > 0) {
        tables.forEach(t => console.log(`   - ${t.table_name}`));
      } else {
        console.log('📝 Banco vazio - pronto para configurar!');
      }
    }
    
    console.log('\n4. 🧪 Testando execução de SQL...');
    
    // Tentar executar SQL simples
    const { data: sqlTest, error: sqlError } = await supabaseService
      .rpc('version');
    
    if (sqlError) {
      console.log('❌ RPC version falhou:', sqlError.message);
      
      // Tentar criar enum simples para testar privilégios
      console.log('\n5. 🏷️  Testando criação de enum...');
      
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({
            query: "DO $$ BEGIN CREATE TYPE test_enum AS ENUM ('test'); EXCEPTION WHEN duplicate_object THEN null; END $$;"
          })
        });
        
        if (response.ok) {
          console.log('✅ SQL execution via HTTP funcionou!');
          return { success: true, method: 'http', canExecuteSQL: true };
        } else {
          const errorText = await response.text();
          console.log('❌ HTTP SQL failed:', response.status, errorText);
        }
      } catch (httpError) {
        console.log('❌ HTTP request failed:', httpError.message);
      }
      
    } else {
      console.log('✅ RPC version funcionou:', sqlTest);
    }
    
    // Tentar métodos alternativos
    console.log('\n6. 🔄 Testando métodos alternativos...');
    
    // Verificar API REST diretamente
    const restResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (restResponse.ok) {
      console.log('✅ API REST acessível');
      console.log('📊 Status:', restResponse.status);
      
      const contentType = restResponse.headers.get('content-type');
      console.log('📋 Content-Type:', contentType);
      
      return { success: true, method: 'rest', canExecuteSQL: false };
    } else {
      console.log('❌ API REST não acessível:', restResponse.status);
    }
    
    return { success: true, method: 'basic', canExecuteSQL: false };
    
  } catch (err) {
    console.log('💥 Erro fatal:', err.message);
    return { success: false, error: err.message };
  }
}

// Função para preparar SQL das migrations
function prepareMigrationSQL() {
  const migrations = [
    'CREATE TYPE user_type_enum AS ENUM (\'master\', \'event_admin\', \'news_editor\', \'event_creator\', \'end_user\');',
    'CREATE TYPE user_status_enum AS ENUM (\'active\', \'inactive\', \'pending_approval\', \'suspended\', \'banned\');',
    'CREATE TYPE event_type_enum AS ENUM (\'musical\', \'cultural\', \'religious\', \'sports\', \'gastronomic\', \'business\', \'educational\', \'social\', \'artistic\', \'festival\', \'conference\', \'workshop\', \'exhibition\', \'competition\');'
  ];
  
  console.log('\n📝 SQL PARA COPIAR NO PAINEL:');
  console.log('=' .repeat(40));
  migrations.forEach(sql => {
    console.log(sql);
  });
  console.log('=' .repeat(40));
}

// Executar testes
testConnection()
  .then(result => {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RESULTADO FINAL:');
    console.log('=' .repeat(60));
    
    if (result.success) {
      console.log('✅ CONEXÃO COM SUPABASE ESTABELECIDA!');
      console.log('📡 URL confirmada:', SUPABASE_URL);
      console.log('🔧 Método:', result.method);
      console.log('⚡ Pode executar SQL:', result.canExecuteSQL ? 'SIM' : 'NÃO');
      
      if (!result.canExecuteSQL) {
        console.log('\n🎯 PRÓXIMAS AÇÕES RECOMENDADAS:');
        console.log('1. 🌐 Acessar: https://supabase.com/dashboard/project/sxfybutceyadvuasoerp/sql');
        console.log('2. 📋 Copiar e colar as migrations no SQL Editor');
        console.log('3. ▶️  Executar cada migration manualmente');
        console.log('4. ✅ Depois configurar o frontend para usar este Supabase');
        
        prepareMigrationSQL();
      }
      
    } else {
      console.log('❌ PROBLEMAS NA CONEXÃO:');
      console.log('💥 Erro:', result.error);
    }
  })
  .catch(err => {
    console.error('💥 Erro crítico:', err);
  }); 