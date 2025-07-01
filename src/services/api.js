// Serviço de API centralizado
// Portal de Eventos Garanhuns

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro na API');
      }

      return data;
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos para eventos
  async getEvents(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'todos') {
        params.append(key, value);
      }
    });

    const endpoint = `/events${params.toString() ? `?${params}` : ''}`;
    return this.request(endpoint);
  }

  async getEvent(slug) {
    return this.request(`/events/${slug}`);
  }

  async searchEvents(query, filters = {}) {
    const params = new URLSearchParams({
      search: query,
      ...filters
    });

    return this.request(`/events?${params}`);
  }

  // Métodos para categorias
  async getCategories() {
    return this.request('/categories');
  }

  // Método de health check
  async checkHealth() {
    return this.request('/health');
  }

  // Utilitários para dados
  formatEventDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('pt-BR', options);
  }

  formatEventTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    
    return date.toLocaleTimeString('pt-BR', options);
  }

  getEventStatus(event) {
    if (!event.start_date) return 'programado';

    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date || event.start_date);

    if (now < startDate) return 'programado';
    if (now >= startDate && now <= endDate) return 'em_andamento';
    return 'finalizado';
  }

  // Conversores para compatibilidade com código existente
  convertEventToLegacyFormat(apiEvent) {
    return {
      id: apiEvent.id,
      titulo: apiEvent.title,
      slug: apiEvent.slug,
      data: apiEvent.start_date?.split('T')[0] || '',
      dataFim: apiEvent.end_date?.split('T')[0] || null,
      local: apiEvent.venue_name || 'Local a definir',
      categoria: apiEvent.category_name || 'Eventos',
      tipo: 'publico',
      descricao: apiEvent.description || apiEvent.short_description || '',
      destaque: apiEvent.is_featured || false,
      preco: apiEvent.is_free ? 'Gratuito' : 'Pago',
      status: this.getEventStatus(apiEvent),
      organizador: 'Prefeitura de Garanhuns',
      cor_categoria: apiEvent.category_color || '#FF6B35',
      imagem: apiEvent.banner_image || null,
      // Propriedades extras do banco
      event_type: apiEvent.event_type,
      venue_name: apiEvent.venue_name,
      start_date: apiEvent.start_date,
      end_date: apiEvent.end_date
    };
  }

  convertCategoryToLegacyFormat(apiCategory) {
    return {
      id: apiCategory.id,
      nome: apiCategory.name,
      slug: apiCategory.slug,
      cor: apiCategory.color,
      icone: apiCategory.icon,
      descricao: apiCategory.description,
      parent_id: apiCategory.parent_id
    };
  }

  // Fallback para imagens
  getEventImage(event, categoria = null) {
    if (event.banner_image) return event.banner_image;
    
    // Usar categoria do evento ou parâmetro
    const cat = categoria || event.category_name || event.categoria || 'default';
    
    const imageBank = {
      'musical': 'https://images.unsplash.com/photo-1493225457124-a3eb5c1c8d7d?w=800&h=400&fit=crop',
      'forró': 'https://images.unsplash.com/photo-1571068316344-7dd2c0ac8e62?w=800&h=400&fit=crop',
      'gospel': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      'religioso': 'https://images.unsplash.com/photo-1438232992991-0b8fa8cc3ddc?w=800&h=400&fit=crop',
      'cultural': 'https://images.unsplash.com/photo-1541961017571-139a7d7ddd6b?w=800&h=400&fit=crop',
      'gastronômico': 'https://images.unsplash.com/photo-1555939594-f7405c036bc2?w=800&h=400&fit=crop',
      'esportivo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      'default': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop'
    };
    
    return imageBank[cat.toLowerCase()] || imageBank.default;
  }
}

// Instância singleton da API
const api = new ApiService();

export default api; 