// Script de teste rápido da API PostgreSQL
console.log('🔄 Testando API do Portal de Eventos...\n');

async function quickTest() {
  try {
    // Health check
    const health = await fetch('http://localhost:3001/api/health');
    const healthData = await health.json();
    console.log('✅ API Health:', healthData.success ? 'OK' : 'ERRO');
    
    // Eventos
    const events = await fetch('http://localhost:3001/api/events');
    const eventsData = await events.json();
    console.log('📅 Eventos encontrados:', eventsData.data?.length || 0);
    
    // Categorias
    const categories = await fetch('http://localhost:3001/api/categories');
    const categoriesData = await categories.json();
    console.log('🏷️ Categorias encontradas:', categoriesData.data?.length || 0);
    
    console.log('\n🎊 Teste concluído com sucesso!');
    console.log('🌐 Frontend: http://localhost:5173');
    console.log('🔗 API: http://localhost:3001/api/health');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('💡 Certifique-se que a API está rodando: npm run api');
  }
}

quickTest(); 