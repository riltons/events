// Hooks customizados para gerenciar eventos via API
// Portal de Eventos Garanhuns

import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

// Hook principal para eventos
export function useEvents(filters = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estabilizar os filtros para evitar re-renders infinitos
  const stableFilters = useMemo(() => {
    return {
      category: filters.category || null,
      search: filters.search || null,
      limit: filters.limit || null
    };
  }, [filters.category, filters.search, filters.limit]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (stableFilters.category && stableFilters.category !== 'todos') {
        params.append('category', stableFilters.category);
      }
      
      if (stableFilters.search) {
        params.append('search', stableFilters.search);
      }
      
      if (stableFilters.limit) {
        params.append('limit', stableFilters.limit);
      }

      const response = await fetch(`${API_BASE_URL}/events?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.error || 'Erro ao carregar eventos');
      }
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [stableFilters.category, stableFilters.search, stableFilters.limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
}

// Hook para evento específico
export function useEvent(slug) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/events/${slug}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setEvent(data.data);
        } else {
          throw new Error(data.error || 'Evento não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar evento:', err);
        setError(err.message);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [slug]);

  return {
    event,
    loading,
    error
  };
}

// Hook para categorias
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/categories`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data);
        } else {
          throw new Error(data.error || 'Erro ao carregar categorias');
        }
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error
  };
}

// Hook para busca de eventos
export function useEventSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query, filters = {}) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        search: query.trim(),
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/events?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        throw new Error(data.error || 'Erro na busca');
      }
    } catch (err) {
      console.error('Erro na busca:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearSearch
  };
}

// Hook para status da API
export function useApiHealth() {
  const [status, setStatus] = useState({
    isOnline: false,
    timestamp: null,
    error: null
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.success) {
          setStatus({
            isOnline: true,
            timestamp: data.timestamp,
            error: null
          });
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        console.error('API offline:', err);
        setStatus({
          isOnline: false,
          timestamp: null,
          error: err.message
        });
      }
    }

    // Verificar imediatamente
    checkHealth();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return status;
}

// Hook para buscar o evento fixado/em destaque
export function useFixedEvent() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFixedEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/events/featured/fixed`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setEvent(data.data); // Pode ser null se não houver evento fixado
      } else {
        throw new Error(data.error || 'Erro ao buscar evento fixado');
      }
    } catch (err) {
      console.error('Erro ao buscar evento fixado:', err);
      setError(err.message);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFixedEvent();
  }, [fetchFixedEvent]);

  return {
    event,
    loading,
    error,
    refetch: fetchFixedEvent
  };
}

// Hook para buscar notícias de um evento
export function useEventNews(eventSlug, options = {}) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { limit = 10, featuredOnly = false } = options;

  const fetchNews = useCallback(async () => {
    if (!eventSlug) {
      setNews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (featuredOnly) params.append('featured_only', 'true');

      const response = await fetch(`${API_BASE_URL}/events/slug/${eventSlug}/news?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setNews(data.data || []);
      } else {
        throw new Error(data.error || 'Erro ao buscar notícias');
      }
    } catch (err) {
      console.error('Erro ao buscar notícias do evento:', err);
      setError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [eventSlug, limit, featuredOnly]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  };
}

// Utilitários para transformar dados da API para formato do frontend
export const formatEventForDisplay = (event) => {
  if (!event) return null;

  return {
    id: event.id,
    titulo: event.title,
    slug: event.slug,
    data: event.start_date,
    dataFim: event.end_date,
    local: event.venue_name || 'Local a definir',
    categoria: event.category_name || 'Sem categoria',
    tipo: 'publico',
    descricao: event.description || '',
    destaque: event.is_featured || false,
    preco: event.is_free ? 'Gratuito' : 'Pago',
    status: event.status,
    organizador: 'Prefeitura de Garanhuns',
    cor_categoria: event.category_color || '#FF6B35'
  };
};

export const formatEventsForDisplay = (events) => {
  return events.map(formatEventForDisplay);
};

// Hook para buscar todas as notícias (gerais)
export function useAllNews(filters = {}) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.category && filters.category !== 'todas') params.append('category', filters.category);
    if (filters.featuredOnly) params.append('featured_only', 'true');
    
    return params.toString();
  }, [filters]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `http://localhost:3001/api/news${queryParams ? `?${queryParams}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data || []);
      } else {
        throw new Error(data.error || 'Erro ao buscar notícias');
      }
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
      setError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews };
} 