// Script para executar migrations no Supabase
// Portal de Eventos Garanhuns
// Usa service role key para executar DDL

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configurações com service role key
const SUPABASE_URL = 'https://sxfybutceyadvuasoerp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIwODAwOCwiZXhwIjoyMDY2Nzg0MDA4fQ.hsXiSo5NYhQ8uLduVmyNrCLv26mDLOciD7fdUsy7_Wg';

console.log('🚀 Executando Migrations - Portal de Eventos Garanhuns');
console.log('=' .repeat(60));

// Criar cliente com service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Lista de migrations em ordem
const migrations = [
  '001_create_enums.sql',
  '002_create_event_categories.sql', 
  '003_create_user_profiles.sql',
  '004_create_events.sql',
  '005_add_fixado_to_events.sql',
  '006_create_event_news.sql'
];

// Função para executar SQL direto
async function executeSQLDirect(sql, migrationName) {
  try {
    console.log(`🔄 Executando ${migrationName}...`);
    
    // Tentar via RPC primeiro
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: sql 
    });
    
    if (error) {
      console.log(`   ❌ Erro via RPC: ${error.message}`);
      
      // Tentar via PostgREST direto
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ query: sql })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`   ❌ Erro HTTP: ${response.status} - ${errorText}`);
        return false;
      }
      
      const result = await response.json();
      console.log(`   ✅ ${migrationName} executada com sucesso via HTTP!`);
      return true;
    }
    
    console.log(`   ✅ ${migrationName} executada com sucesso via RPC!`);
    return true;
    
  } catch (err) {
    console.log(`   💥 Erro fatal em ${migrationName}: ${err.message}`);
    return false;
  }
}

// Função para executar migration individual
async function executeMigration(filename) {
  try {
    const migrationPath = join('database', 'migrations', filename);
    const sql = readFileSync(migrationPath, 'utf8');
    
    console.log(`📋 Lendo ${filename}...`);
    console.log(`   📊 Tamanho: ${sql.length} caracteres`);
    
    // Dividir em comandos individuais se necessário
    const commands = sql.split(';\n').filter(cmd => cmd.trim() && !cmd.trim().startsWith('--'));
    
    console.log(`   🔧 Comandos encontrados: ${commands.length}`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command) {
        console.log(`   🔄 Executando comando ${i + 1}/${commands.length}...`);
        
        const success = await executeSQLDirect(command + ';', `${filename} (${i + 1})`);
        if (!success) {
          console.log(`   ❌ Falha no comando ${i + 1} de ${filename}`);
          return false;
        }
      }
    }
    
    console.log(`   ✅ ${filename} concluída com sucesso!\n`);
    return true;
    
  } catch (err) {
    console.log(`   💥 Erro ao ler ${filename}: ${err.message}\n`);
    return false;
  }
}

// Executar todas as migrations
async function runAllMigrations() {
  console.log('🗄️  Iniciando execução das migrations...\n');
  
  let successCount = 0;
  let totalMigrations = migrations.length;
  
  for (const migration of migrations) {
    const success = await executeMigration(migration);
    if (success) {
      successCount++;
    } else {
      console.log(`❌ Parando execução devido a erro em ${migration}`);
      break;
    }
  }
  
  console.log('=' .repeat(60));
  console.log('📊 RESULTADO DAS MIGRATIONS:');
  console.log('=' .repeat(60));
  console.log(`✅ Executadas com sucesso: ${successCount}/${totalMigrations}`);
  console.log(`❌ Falharam: ${totalMigrations - successCount}/${totalMigrations}`);
  
  if (successCount === totalMigrations) {
    console.log('\n🎉 TODAS AS MIGRATIONS EXECUTADAS COM SUCESSO!');
    console.log('✅ Banco de dados está pronto para uso!');
    return true;
  } else {
    console.log('\n⚠️  ALGUMAS MIGRATIONS FALHARAM!');
    console.log('🔧 Verifique os erros acima e tente novamente.');
    return false;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllMigrations()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('💥 Erro fatal:', err);
      process.exit(1);
    });
}

export { runAllMigrations, executeMigration }; 