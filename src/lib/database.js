// Utilitário para conexão com PostgreSQL - Ambiente de Desenvolvimento
// Portal de Eventos Garanhuns
// NOTA: Em produção, use uma API backend ao invés de conexão direta

// Configurações do banco local
export const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'eventos_garanhuns_dev',
  user: 'postgres',
  password: 'postgres123',
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/eventos_garanhuns_dev'
};

// Função para testar conexão (apenas para desenvolvimento)
export async function testDatabaseConnection() {
  try {
    // Em um ambiente real, isso seria uma chamada para sua API backend
    const response = await fetch('/api/test-connection');
    const result = await response.json();
    
    console.log('🔄 Testando conexão via API...');
    if (result.success) {
      console.log('✅ API conectada ao banco com sucesso!');
      return { success: true, data: result };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    return { success: false, error: error.message };
  }
}

// Simulação de funções que você usaria com uma API backend
export const eventService = {
  // Listar eventos
  async getEvents(filters = {}) {
    // Em produção: fetch('/api/events', { params: filters })
    console.log('📋 Buscando eventos...', filters);
    return mockEvents;
  },
  
  // Buscar evento por slug
  async getEventBySlug(slug) {
    // Em produção: fetch(`/api/events/${slug}`)
    console.log(`🔍 Buscando evento: ${slug}`);
    return mockEvents.find(event => event.slug === slug);
  },
  
  // Listar categorias
  async getCategories() {
    // Em produção: fetch('/api/categories')
    console.log('🏷️ Buscando categorias...');
    return mockCategories;
  }
};

// Dados mock para desenvolvimento (substitua por calls da API)
const mockEvents = [
  {
    id: '1',
    title: 'Festival de Forró de Garanhuns 2025',
    slug: 'festival-forro-garanhuns-2025',
    description: 'O maior festival de forró do agreste pernambucano',
    event_type: 'musical',
    category_id: 'forro',
    start_date: new Date('2025-07-15'),
    end_date: new Date('2025-07-20'),
    venue_name: 'Parque Ruber van der Linden',
    is_featured: true,
    status: 'published'
  }
];

const mockCategories = [
  { id: '1', name: 'Musical', slug: 'musical', color: '#FF6B35' },
  { id: '2', name: 'Forró', slug: 'forro', color: '#FFB347', parent_id: '1' },
  { id: '3', name: 'Cultural', slug: 'cultural', color: '#45B7D1' },
  { id: '4', name: 'Religioso', slug: 'religioso', color: '#4ECDC4' }
];

export default { DB_CONFIG, testDatabaseConnection, eventService }; 