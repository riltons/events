// Configuração do Supabase Remoto
// Portal de Eventos Garanhuns

// Credenciais do Supabase
export const SUPABASE_CONFIG = {
  url: 'https://sxfybutceyadvuasoerp.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDgwMDgsImV4cCI6MjA2Njc4NDAwOH0.OqTIfBrK1qvKQX1PoUOrYIhgRaGNMhq5Z6TM-LgSs50',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIwODAwOCwiZXhwIjoyMDY2Nzg0MDA4fQ.hsXiSo5NYhQ8uLduVmyNrCLv26mDLOciD7fdUsy7_Wg',
  projectId: 'sxfybutceyadvuasoerp',
  dbPassword: 'RzCkPIgUziSyaZzB'
};

// URL de conexão direta com o PostgreSQL
export const DATABASE_URL = 'postgresql://postgres.sxfybutceyadvuasoerp:RzCkPIgUziSyaZzB@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

// Para usar no frontend (apenas chaves públicas)
export const FRONTEND_CONFIG = {
  VITE_SUPABASE_URL: SUPABASE_CONFIG.url,
  VITE_SUPABASE_ANON_KEY: SUPABASE_CONFIG.anonKey
};

console.log('🔧 Configuração do Supabase carregada:');
console.log('📡 URL:', SUPABASE_CONFIG.url);
console.log('🔑 Project ID:', SUPABASE_CONFIG.projectId);
console.log('✅ Configuração pronta para uso!');

export default SUPABASE_CONFIG; 