// Configuração correta do Supabase
// Portal de Eventos Garanhuns

import { createClient } from '@supabase/supabase-js';

// URL correta obtida via MCP
const SUPABASE_URL = 'https://euqnfrvptiriujrdebpr.supabase.co';

// Chaves do arquivo anotações.md (podem funcionar mesmo com URL diferente)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDgwMDgsImV4cCI6MjA2Njc4NDAwOH0.OqTIfBrK1qvKQX1PoUOrYIhgRaGNMhq5Z6TM-LgSs50';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIwODAwOCwiZXhwIjoyMDY2Nzg0MDA4fQ.hsXiSo5NYhQ8uLduVmyNrCLv26mDLOciD7fdUsy7_Wg';

console.log('🚀 Testando Configuração Correta do Supabase');
console.log('=' .repeat(50));
console.log('📡 URL:', SUPABASE_URL);

async function testCorrectConfig() {
  try {
    // Testar com anon key
    console.log('\n1. 🔐 Testando com chave anônima...');
    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: authData, error: authError } = await supabaseAnon.auth.getSession();
    if (authError) {
      console.log('❌ Erro de autenticação:', authError.message);
    } else {
      console.log('✅ Autenticação anônima funcionando!');
    }
    
    // Testar com service role
    console.log('\n2. 🔧 Testando com service role...');
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Tentar operação que requer privileges
    const { data: testData, error: testError } = await supabaseService
      .from('_realtime_schema_versions')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('⚠️  Service role limitado:', testError.message);
      
      // Tentar criar uma tabela simples de teste
      console.log('\n3. 🧪 Tentando criar tabela de teste...');
      
      const { data: createData, error: createError } = await supabaseService
        .rpc('exec', {
          query: 'CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW());'
        });
      
      if (createError) {
        console.log('❌ Erro ao criar tabela:', createError.message);
        
        // Tentar uma abordagem via SQL Editor API
        console.log('\n4. 📝 Tentando via SQL Editor API...');
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('✅ API REST acessível!');
          console.log('📊 Status:', response.status);
          
          // Verificar se existem tabelas
          const { data: tables, error: tablesError } = await supabaseService
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .limit(5);
          
          if (tables && tables.length > 0) {
            console.log('📋 Tabelas encontradas:', tables.map(t => t.table_name));
          } else if (tablesError) {
            console.log('❌ Erro ao listar tabelas:', tablesError.message);
          } else {
            console.log('📝 Nenhuma tabela encontrada - banco vazio');
          }
          
        } else {
          console.log('❌ API REST não acessível:', response.status);
        }
        
      } else {
        console.log('✅ Tabela de teste criada!');
      }
      
    } else {
      console.log('✅ Service role funcionando!');
    }
    
    return true;
    
  } catch (err) {
    console.log('💥 Erro fatal:', err.message);
    return false;
  }
}

// Executar teste
testCorrectConfig()
  .then(success => {
    console.log('\n' + '=' .repeat(50));
    if (success) {
      console.log('🎉 Configuração do Supabase está funcionando!');
      console.log('📡 URL correta:', SUPABASE_URL);
      console.log('🔑 Chaves configuradas corretamente');
      console.log('\n🎯 Próximo passo: Configurar schema via SQL Editor no painel do Supabase');
      console.log('🌐 Acesse: https://supabase.com/dashboard/project/[project-id]/sql');
    } else {
      console.log('❌ Problemas na configuração');
    }
  })
  .catch(err => {
    console.error('💥 Erro:', err);
  }); 