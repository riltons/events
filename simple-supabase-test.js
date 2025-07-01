// Teste simplificado de conexão com Supabase
// Portal de Eventos Garanhuns

import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const SUPABASE_URL = 'https://sxfybutceyadvuasoerp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDgwMDgsImV4cCI6MjA2Njc4NDAwOH0.OqTIfBrK1qvKQX1PoUOrYIhgRaGNMhq5Z6TM-LgSs50';

console.log('🚀 Teste Simples de Conexão com Supabase');
console.log('📡 URL:', SUPABASE_URL);
console.log('🔄 Inicializando cliente...\n');

async function testConnection() {
  try {
    // Criar cliente Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Cliente Supabase criado com sucesso!');
    
    // Teste de ping simples
    console.log('🔍 Testando conectividade...');
    
    const { data, error } = await supabase
      .from('pg_stat_activity')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('❌ Erro na consulta:', error.message);
      
      // Tentar um teste ainda mais simples
      console.log('🔄 Tentando teste alternativo...');
      const { data: healthData, error: healthError } = await supabase
        .rpc('pg_backend_pid');
      
      if (healthError) {
        console.log('❌ Erro no teste alternativo:', healthError.message);
        return false;
      } else {
        console.log('✅ Teste alternativo funcionou! Backend PID:', healthData);
        return true;
      }
    }
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Resultado:', data);
    return true;
    
  } catch (err) {
    console.log('💥 Erro fatal:', err.message);
    return false;
  }
}

// Executar teste
testConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 SUCESSO! Supabase está conectado e funcionando!');
      console.log('✅ Pronto para usar o banco remoto!');
    } else {
      console.log('\n❌ FALHA! Problemas na conexão com Supabase.');
      console.log('🔧 Verifique as credenciais e tente novamente.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('💥 Erro fatal:', err);
    process.exit(1);
  }); 