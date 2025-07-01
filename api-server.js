// API Server - Portal de Eventos Garanhuns
// Servidor Express.js para conectar frontend React ao banco PostgreSQL

import express from 'express';
import cors from 'cors';
import { Client } from 'pg';

const app = express();
const PORT = 3001;

// Configuração do banco
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'eventos_garanhuns_dev',
  user: 'postgres',
  password: 'postgres123',
};

// Middleware
app.use(cors());
app.use(express.json());

// Função para conectar ao banco
async function connectDB() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const client = await connectDB();
    const result = await client.query('SELECT NOW()');
    await client.end();
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📋 ROTAS DE EVENTOS

// Listar eventos
app.get('/api/events', async (req, res) => {
  try {
    const client = await connectDB();
    const { category, search, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        e.id, e.title, e.slug, e.description, e.short_description,
        e.event_type, e.start_date, e.end_date, e.venue_name,
        e.is_featured, e.is_free, e.status, e.fixado,
        c.name as category_name, c.color as category_color
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.deleted_at IS NULL AND e.status = 'published'
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (category && category !== 'todos') {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
    }
    
    if (search) {
      paramCount++;
      query += ` AND e.title ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY e.start_date ASC LIMIT $${paramCount + 1}`;
    params.push(limit);
    
    const result = await client.query(query, params);
    await client.end();
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar evento fixado/em destaque
app.get('/api/events/featured/fixed', async (req, res) => {
  try {
    const client = await connectDB();
    
    const result = await client.query(`
      SELECT 
        e.id, e.title, e.slug, e.description, e.short_description,
        e.event_type, e.start_date, e.end_date, e.venue_name,
        e.is_featured, e.is_free, e.status, e.fixado,
        e.capacity, e.min_age, e.max_age, e.dress_code,
        e.address, e.location_instructions, e.organizer_info,
        e.contact_info, e.social_links, e.external_links,
        e.accessibility_info, e.ticket_info, e.sponsors,
        e.tags, e.keywords, e.meta_title, e.meta_description,
        c.name as category_name, c.color as category_color, c.slug as category_slug
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.fixado = TRUE AND e.deleted_at IS NULL AND e.status = 'published'
      ORDER BY e.start_date ASC
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      await client.end();
      return res.json({ success: true, data: null, message: 'Nenhum evento fixado encontrado' });
    }
    
    await client.end();
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar evento por slug
app.get('/api/events/:slug', async (req, res) => {
  try {
    const client = await connectDB();
    const { slug } = req.params;
    
    const result = await client.query(`
      SELECT e.*, c.name as category_name, c.color as category_color
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.slug = $1 AND e.deleted_at IS NULL
    `, [slug]);
    
    if (result.rows.length === 0) {
      await client.end();
      return res.status(404).json({ success: false, error: 'Evento não encontrado' });
    }
    
    await client.end();
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📰 ROTAS DE NOTÍCIAS

// Buscar todas as notícias (gerais)
app.get('/api/news', async (req, res) => {
  try {
    const client = await connectDB();
    const { limit = 20, category, featured_only = false } = req.query;
    
    let query = `
      SELECT 
        n.id, n.title, n.slug, n.content, n.summary,
        n.author_name, n.featured_image_url, n.is_featured,
        n.published_at, n.created_at,
        e.title as event_title, e.slug as event_slug,
        c.name as category_name
      FROM event_news n
      INNER JOIN events e ON n.event_id = e.id
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE n.is_published = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (category && category !== 'todas') {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
    }
    
    if (featured_only === 'true') {
      paramCount++;
      query += ` AND n.is_featured = true`;
      params.push(true);
    }
    
    query += ` ORDER BY n.published_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);
    
    const result = await client.query(query, params);
    await client.end();
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar notícias de um evento específico
app.get('/api/events/:eventId/news', async (req, res) => {
  try {
    const client = await connectDB();
    const { eventId } = req.params;
    const { limit = 10, featured_only = false } = req.query;
    
    let query = `
      SELECT 
        n.id, n.title, n.slug, n.content, n.summary,
        n.author_name, n.featured_image_url, n.is_featured,
        n.published_at, n.created_at,
        e.title as event_title, e.slug as event_slug
      FROM event_news n
      INNER JOIN events e ON n.event_id = e.id
      WHERE n.event_id = $1 AND n.is_published = true
    `;
    
    const params = [eventId];
    let paramCount = 1;
    
    if (featured_only === 'true') {
      query += ` AND n.is_featured = true`;
    }
    
    query += ` ORDER BY n.published_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);
    
    const result = await client.query(query, params);
    await client.end();
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar notícias por slug do evento
app.get('/api/events/slug/:eventSlug/news', async (req, res) => {
  try {
    const client = await connectDB();
    const { eventSlug } = req.params;
    const { limit = 10, featured_only = false } = req.query;
    
    let query = `
      SELECT 
        n.id, n.title, n.slug, n.content, n.summary,
        n.author_name, n.featured_image_url, n.is_featured,
        n.published_at, n.created_at,
        e.title as event_title, e.slug as event_slug
      FROM event_news n
      INNER JOIN events e ON n.event_id = e.id
      WHERE e.slug = $1 AND n.is_published = true
    `;
    
    const params = [eventSlug];
    let paramCount = 1;
    
    if (featured_only === 'true') {
      query += ` AND n.is_featured = true`;
    }
    
    query += ` ORDER BY n.published_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);
    
    const result = await client.query(query, params);
    await client.end();
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar uma notícia específica
app.get('/api/news/:slug', async (req, res) => {
  try {
    const client = await connectDB();
    const { slug } = req.params;
    
    const result = await client.query(`
      SELECT 
        n.*,
        e.title as event_title, e.slug as event_slug
      FROM event_news n
      INNER JOIN events e ON n.event_id = e.id
      WHERE n.slug = $1 AND n.is_published = true
    `, [slug]);
    
    if (result.rows.length === 0) {
      await client.end();
      return res.status(404).json({ success: false, error: 'Notícia não encontrada' });
    }
    
    await client.end();
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🏷️ ROTAS DE CATEGORIAS

// Listar categorias
app.get('/api/categories', async (req, res) => {
  try {
    const client = await connectDB();
    const result = await client.query(`
      SELECT id, name, slug, description, icon, color, parent_id
      FROM event_categories 
      WHERE is_active = true
      ORDER BY sort_order, name
    `);
    await client.end();
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📊 ROTAS DE ESTATÍSTICAS

// Estatísticas gerais
app.get('/api/stats', async (req, res) => {
  try {
    const client = await connectDB();
    
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM events WHERE status = 'published' AND deleted_at IS NULL) as total_events,
        (SELECT COUNT(*) FROM events WHERE status = 'published' AND start_date >= NOW() AND deleted_at IS NULL) as upcoming_events,
        (SELECT COUNT(*) FROM event_categories WHERE is_active = true) as total_categories,
        (SELECT COUNT(*) FROM user_profiles) as total_users,
        (SELECT SUM(view_count) FROM events) as total_views
    `);
    
    await client.end();
    
    res.json({
      success: true,
      data: stats.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 🔍 ROTAS DE BUSCA

// Busca avançada
app.get('/api/search', async (req, res) => {
  try {
    const client = await connectDB();
    const { q, category, date_from, date_to, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro de busca obrigatório'
      });
    }
    
    let query = `
      SELECT 
        e.id, e.title, e.slug, e.short_description,
        e.start_date, e.venue_name, e.is_featured,
        c.name as category_name, c.color as category_color,
        ts_rank(
          to_tsvector('portuguese', e.title || ' ' || COALESCE(e.description, '') || ' ' || COALESCE(e.venue_name, '')),
          plainto_tsquery('portuguese', $1)
        ) as rank
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      WHERE e.deleted_at IS NULL 
        AND e.status = 'published'
        AND to_tsvector('portuguese', e.title || ' ' || COALESCE(e.description, '') || ' ' || COALESCE(e.venue_name, ''))
            @@ plainto_tsquery('portuguese', $1)
    `;
    
    const params = [q];
    let paramCount = 1;
    
    if (category && category !== 'todos') {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
    }
    
    if (date_from) {
      paramCount++;
      query += ` AND e.start_date >= $${paramCount}`;
      params.push(date_from);
    }
    
    if (date_to) {
      paramCount++;
      query += ` AND e.start_date <= $${paramCount}`;
      params.push(date_to);
    }
    
    query += ` ORDER BY rank DESC, e.is_featured DESC, e.start_date ASC LIMIT $${paramCount + 1}`;
    params.push(limit);
    
    const result = await client.query(query, params);
    await client.end();
    
    res.json({
      success: true,
      data: result.rows,
      query: q,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API Server rodando em http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎉 Eventos: http://localhost:${PORT}/api/events`);
  console.log(`⭐ Evento Fixado: http://localhost:${PORT}/api/events/featured/fixed`);
  console.log(`📰 Todas as notícias: http://localhost:${PORT}/api/news`);
  console.log(`📰 Notícias por evento: http://localhost:${PORT}/api/events/slug/[evento-slug]/news`);
  console.log(`🏷️ Categorias: http://localhost:${PORT}/api/categories`);
}); 