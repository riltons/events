// Utilitário para conexão com PostgreSQL - Ambiente de Desenvolvimento
// Portal de Eventos Garanhuns
// NOTA: Em produção, use uma API backend ao invés de conexão direta

// Configurações do Supabase Remoto
// Portal de Eventos Garanhuns

import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase remoto
const supabaseUrl = 'https://sxfybutceyadvuasoerp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnlidXRjZXlhZHZ1YXNvZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDgwMDgsImV4cCI6MjA2Njc4NDAwOH0.OqTIfBrK1qvKQX1PoUOrYIhgRaGNMhq5Z6TM-LgSs50'

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para buscar eventos
export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_categories (
          name,
          slug,
          color,
          icon
        )
      `)
      .eq('status', 'published')
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Erro ao buscar eventos:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Erro na consulta de eventos:', err)
    return []
  }
}

// Função para buscar eventos da semana
export async function getEventosSemanais() {
  try {
    const agora = new Date()
    const proximoDomingo = new Date(agora)
    proximoDomingo.setDate(agora.getDate() + (7 - agora.getDay()))
    proximoDomingo.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_categories (
          name,
          slug,
          color,
          icon
        )
      `)
      .eq('status', 'published')
      .gte('start_date', agora.toISOString())
      .lte('start_date', proximoDomingo.toISOString())
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Erro ao buscar eventos semanais:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Erro na consulta de eventos semanais:', err)
    return []
  }
}

// Função para buscar eventos em destaque
export async function getEventosDestaque() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_categories (
          name,
          slug,
          color,
          icon
        )
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('start_date', { ascending: true })
      .limit(6)

    if (error) {
      console.error('Erro ao buscar eventos em destaque:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Erro na consulta de eventos em destaque:', err)
    return []
  }
}

// Função para buscar categorias
export async function getCategorias() {
  try {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Erro ao buscar categorias:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Erro na consulta de categorias:', err)
    return []
  }
}

// Função para buscar notícias
export async function getNoticias() {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Erro ao buscar notícias:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Erro na consulta de notícias:', err)
    return []
  }
}

// Função para buscar evento por ID
export async function getEventById(id) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_categories (
          name,
          slug,
          color,
          icon
        )
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Erro ao buscar evento por ID:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro na consulta de evento por ID:', err)
    return null
  }
}

// Função de fallback (dados mockados para desenvolvimento)
export function getFallbackEvents() {
  return [
    {
      id: 'fallback-1',
      title: 'Conectando com Supabase...',
      short_description: 'Carregando eventos do banco de dados remoto...',
      start_date: new Date().toISOString(),
      venue_name: 'Configurando conexão...',
      is_free: true,
      status: 'published',
      event_categories: {
        name: 'Sistema',
        color: '#6366f1'
      }
    }
  ]
}

// Log de configuração
console.log('🔗 Database.js configurado para Supabase remoto')
console.log('📡 URL:', supabaseUrl)
console.log('✅ Cliente Supabase inicializado')

export default supabase 