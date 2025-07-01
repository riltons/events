import React, { useState, useEffect, useMemo } from 'react'
import { Calendar, MapPin, Clock, Search, Filter, Star, Music, Utensils, Heart, Sparkles, Camera, Image, Users, Info, Navigation, Phone, Newspaper, Play, AlertCircle, Bell, Menu, X, Briefcase, ArrowRight, Database, Building, Ticket, MessageCircle, Mail, Shirt, ChevronDown } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
// Hooks da API
import { useEvents, useCategories, useApiHealth, useFixedEvent, useEventNews, useAllNews } from './hooks/useEvents'
import api from './services/api'
import { NewsCarousel } from './components/NewsCarousel'
import NotificationSystem from './components/NotificationSystem'
import TestPage from './TestPage'
import './App.css'

// Estilos CSS para corrigir z-index e posicionamento
const stickyStyles = `
  .header-sticky {
    z-index: 100 !important;
    position: fixed !important;
  }
  
  .sidebar-sticky {
    z-index: 5 !important;
    position: sticky !important;
    top: 6rem !important;
    max-height: calc(100vh - 7rem) !important;
    overflow-y: auto !important;
  }
  
  .sidebar-sticky::-webkit-scrollbar {
    width: 4px;
  }
  
  .sidebar-sticky::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  .sidebar-sticky::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
  
  .sidebar-sticky::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

// Função para adaptar dados da API para o formato do App
const adaptEventFromApi = (apiEvent) => {
  if (!apiEvent) return null;
  
  // Função auxiliar para processar campos JSON de forma segura
  const parseJSONField = (field) => {
    if (!field) return null;
    if (typeof field === 'object') return field; // Já é um objeto
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.warn('Erro ao fazer parse de campo JSON:', field, e);
        return null;
      }
    }
    return null;
  };
  
  // Processar dados JSON da API
  const endereco = parseJSONField(apiEvent.address);
  const organizador = parseJSONField(apiEvent.organizer_info);
  const contato = parseJSONField(apiEvent.contact_info);
  const acessibilidade = parseJSONField(apiEvent.accessibility_info);
  const ingressos = parseJSONField(apiEvent.ticket_info);
  
  // Separar descrição curta da programação completa
  const descricaoCompleta = apiEvent.description || '';
  const descricaoCurta = apiEvent.short_description || 
    (descricaoCompleta.length > 200 ? 
      descricaoCompleta.split('\n')[0].substring(0, 200) + '...' : 
      descricaoCompleta);
  
  return {
    id: apiEvent.id,
    titulo: apiEvent.title,
    slug: apiEvent.slug,
    data: apiEvent.start_date,
    dataFim: apiEvent.end_date || apiEvent.start_date,
    local: apiEvent.venue_name || 'Local a confirmar',
    categoria: apiEvent.category_name || 'Geral',
    tipo: 'publico', // Todos os eventos da API são públicos por enquanto
    descricao: descricaoCurta, // Usar descrição curta para exibição geral
    descricaoCompleta: descricaoCompleta, // Manter programação completa separada
    destaque: apiEvent.is_featured || false,
    preco: apiEvent.is_free ? 'Gratuito' : 'Pago',
    organizador: organizador?.name || 'Prefeitura de Garanhuns',
    status: apiEvent.status || 'programado',
    cor_categoria: apiEvent.category_color || '#FF6B35',
    
    // Novos campos detalhados
    capacidade: apiEvent.capacity || null,
    endereco_completo: endereco,
    instrucoes_local: apiEvent.location_instructions,
    contato_evento: contato,
    acessibilidade_info: acessibilidade,
    informacoes_ingresso: ingressos,
    dress_code: apiEvent.dress_code,
    
    // Campos simulados para compatibilidade com interface
    programacao: [],
    locais: [{
      nome: apiEvent.venue_name || 'Local a confirmar',
      endereco: endereco ? `${endereco.street}, ${endereco.neighborhood}, ${endereco.city}` : 'Endereço a confirmar',
      tipo: 'local_principal',
      instrucoes: apiEvent.location_instructions || 'Instruções a definir'
    }],
    noticias: [],
    informacoes: {
      duracao: apiEvent.start_date && apiEvent.end_date ? 
        `${new Date(apiEvent.start_date).toLocaleDateString('pt-BR')} a ${new Date(apiEvent.end_date).toLocaleDateString('pt-BR')}` : 
        'A confirmar',
      publico_esperado: apiEvent.capacity ? `${apiEvent.capacity} pessoas` : 'A definir',
      restricoes: ingressos?.age_restriction || 'Conforme regulamentação do evento',
      acessibilidade: acessibilidade?.wheelchair_accessible ? 'Local acessível para cadeirantes' : 'Local acessível',
      estacionamento: 'Estacionamento disponível nas ruas adjacentes',
      transporte_publico: apiEvent.location_instructions || 'Consultar transporte público local',
      dress_code: apiEvent.dress_code || 'Casual',
      contato: contato?.primary_phone || contato?.email || '(87) 3761-4000',
      emergencia: contato?.emergency_phone || '193'
    }
  };
};

function App() {
  // Hook para buscar notícias gerais do banco de dados
  const { news: noticiasApi, loading: noticiasGeraisLoading, error: noticiasGeraisError } = useAllNews({ limit: 20 });

  // Adaptar notícias da API para o formato do frontend
  const noticiasData = useMemo(() => {
    return noticiasApi.map(noticia => ({
      id: noticia.id,
      titulo: noticia.title,
      resumo: noticia.summary || noticia.content?.substring(0, 150) + '...',
      data: noticia.published_at,
      categoria: noticia.category_name || 'Geral',
      autor: noticia.author_name,
      destaque: noticia.is_featured
    }));
  }, [noticiasApi]);
  // Estados da aplicação
  const [filtroCategoria, setFiltroCategoria] = useState('todos')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroPreco, setFiltroPreco] = useState('todos')
  const [busca, setBusca] = useState('')
  const [activeTab, setActiveTab] = useState('programacao')

  const [eventosFavoritos, setEventosFavoritos] = useState(new Set())
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState('home') // 'home', 'noticias', ou 'test-api'
  
  // Estados específicos da página de notícias
  const [buscaNoticias, setBuscaNoticias] = useState('')
  const [filtroCategoriaNoticias, setFiltroCategoriaNoticias] = useState('todas')
  const [filtroAutor, setFiltroAutor] = useState('todos')
  const [ordenacao, setOrdenacao] = useState('mais-recentes')
  const [noticiaDestaque, setNoticiaDestaque] = useState(null)

  // Hooks da API
  const apiFilters = useMemo(() => ({
    category: filtroCategoria !== 'todos' ? filtroCategoria : undefined,
    search: busca || undefined,
    limit: 50 // Carregar mais eventos para ter variedade
  }), [filtroCategoria, busca]);
  
  const { events: apiEvents, loading: eventsLoading, error: eventsError } = useEvents(apiFilters);
  const { categories: apiCategories } = useCategories();
  const apiStatus = useApiHealth();
  const { event: eventoFixado, loading: eventoFixadoLoading } = useFixedEvent();
  
  // Hook para notícias do evento fixado (buscar notícias em destaque primeiro)
  const { news: noticiasEventoFixado, loading: noticiasLoading } = useEventNews(
    eventoFixado?.slug, 
    { limit: 10, featuredOnly: false } // Buscar todas, mas processar corretamente no frontend
  );

  // Adaptar eventos da API para o formato do App
  const eventos = useMemo(() => {
    return apiEvents.map(adaptEventFromApi).filter(Boolean);
  }, [apiEvents]);

  // Adaptar categorias da API  
  const categorias = useMemo(() => {
    const cats = apiCategories
      .filter(cat => !cat.parent_id) // Apenas categorias principais
      .map(cat => ({
        id: cat.slug,
        nome: cat.name,
        cor: cat.color || '#FF6B35',
        icone: cat.name.toLowerCase()
      }));
    return cats;
  }, [apiCategories]);

  // Estado do evento em destaque (baseado nos dados reais)
  const [eventoDestaque, setEventoDestaque] = useState(null);
  
  // Estado para controlar o acordeão da programação
  const [poloAbertoIndex, setPoloAbertoIndex] = useState(0); // Primeiro polo aberto por padrão

  // Utilitários para compatibilidade (adaptados dos dados estáticos)
  const formatarData = (data: string, dataFim: string | null = null) => {
    const dataInicio = new Date(data);
    const opcoes: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'America/Recife'
    };
    
    if (dataFim && dataFim !== data) {
      const dataFinal = new Date(dataFim);
      return `${dataInicio.toLocaleDateString('pt-BR', opcoes)} a ${dataFinal.toLocaleDateString('pt-BR', opcoes)}`;
    }
    
    return dataInicio.toLocaleDateString('pt-BR', opcoes);
  };

  const formatarDataCurta = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatarTempoRelativo = (data: string) => {
    const agora = new Date();
    const dataNoticia = new Date(data);
    const diferenca = agora.getTime() - dataNoticia.getTime();
    
    const minutos = Math.floor(diferenca / (1000 * 60));
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) {
      return minutos <= 1 ? 'Agora' : `Há ${minutos} min`;
    } else if (horas < 24) {
      return `Há ${horas}h`;
    } else if (dias < 7) {
      return `Há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
    } else {
      return dataNoticia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getProximoEvento = (eventos: any[]) => {
    const hoje = new Date();
    const eventosOrdenados = eventos
      .filter(evento => new Date(evento.data) >= hoje)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    
    return eventosOrdenados.length > 0 ? eventosOrdenados[0] : eventos.find(e => e.destaque);
  };

  const getStatusEvento = (evento: any) => {
    const hoje = new Date();
    const dataEvento = new Date(evento.data);
    const dataFim = evento.dataFim ? new Date(evento.dataFim) : dataEvento;
    
    if (hoje.getTime() < dataEvento.getTime()) return 'programado';
    if (hoje.getTime() > dataFim.getTime()) return 'finalizado';
    return 'em_andamento';
  };

  const getEventosDaSemana = (eventos: any[]) => {
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);
    
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento >= hoje && dataEvento <= proximaSemana;
    });
  };

  const getEventosDestaque = (eventos: any[]) => {
    return eventos.filter(evento => evento.destaque === true);
  };

  const getEventosDoMes = (eventos: any[]) => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento >= inicioMes && dataEvento <= fimMes;
    });
  };

  useEffect(() => {
    if (eventoFixado && !eventoFixadoLoading) {
      // Usar evento fixado da API se disponível
      const eventoFormatado = adaptEventFromApi(eventoFixado);
      if (eventoFormatado) {
        const noticiasProcessadas = noticiasEventoFixado?.map(noticia => ({
          id: noticia.id,
          titulo: noticia.title,
          resumo: noticia.summary || noticia.content?.substring(0, 150) + '...',
          autor: noticia.author_name,
          tempo: formatarTempoRelativo(noticia.published_at),
          categoria: eventoFormatado.categoria,
          destaque: noticia.is_featured,
          data: noticia.published_at // Campo necessário para o NewsCarousel
        })) || [];

        setEventoDestaque({
          ...eventoFormatado,
          statusAtual: getStatusEvento(eventoFormatado),
          noticias: noticiasProcessadas
        });
      }
    } else if (eventos.length > 0 && !eventoFixado) {
      // Fallback para getProximoEvento se não houver evento fixado
      const eventoAtual = getProximoEvento(eventos);
    if (eventoAtual) {
      setEventoDestaque({
        ...eventoAtual,
        statusAtual: getStatusEvento(eventoAtual)
        });
      }
    }
  }, [eventos, eventoFixado, eventoFixadoLoading, noticiasEventoFixado]);



  const eventosFiltrados = eventos.filter(evento => {
    // Filtro de favoritos
    if (mostrarFavoritos && !eventosFavoritos.has(evento.id)) {
      return false
    }
    
    // Filtro de categoria
    const matchCategoria = filtroCategoria === 'todos' || evento.categoria.toLowerCase() === filtroCategoria.toLowerCase()
    
    // Filtro de tipo (público/privado)
    const matchTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo
    
    // Filtro de preço
    let matchPreco = true
    if (filtroPreco === 'gratuito') {
      matchPreco = evento.preco.toLowerCase().includes('gratuito') || evento.preco === 'R$ 0,00'
    } else if (filtroPreco === 'pago') {
      matchPreco = !evento.preco.toLowerCase().includes('gratuito') && evento.preco !== 'R$ 0,00'
    }
    
    // Filtro de busca (já aplicado na API, mas mantido para filtros locais)
    const matchBusca = !busca || evento.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                      evento.local.toLowerCase().includes(busca.toLowerCase()) ||
                      evento.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                      evento.organizador.toLowerCase().includes(busca.toLowerCase())
    
    return matchCategoria && matchTipo && matchPreco && matchBusca
  })

  const toggleFavorito = (eventoId) => {
    setEventosFavoritos(prev => {
      const newFavoritos = new Set(prev)
      if (newFavoritos.has(eventoId)) {
        newFavoritos.delete(eventoId)
      } else {
        newFavoritos.add(eventoId)
      }
      // Salvar no localStorage
      localStorage.setItem('eventosFavoritos', JSON.stringify([...newFavoritos]))
      return newFavoritos
    })
  }

  // Carregar favoritos do localStorage
  useEffect(() => {
    const favoritosSalvos = localStorage.getItem('eventosFavoritos')
    if (favoritosSalvos) {
      setEventosFavoritos(new Set(JSON.parse(favoritosSalvos)))
    }
  }, [])

  // Fechar menu mobile ao clicar fora ou scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Não fechar se clicar no próprio botão do menu
      if (event.target.closest('.menu-toggle-btn')) {
        return
      }
      setMenuMobileAberto(false)
    }

    const handleScroll = () => {
      setMenuMobileAberto(false)
    }

    if (menuMobileAberto) {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [menuMobileAberto])

  const getCategoriaIcon = (categoria) => {
    switch (categoria.toLowerCase()) {
      case 'musical':
      case 'forró':
      case 'gospel':
        return <Music className="w-4 h-4" />
      case 'religioso':
        return <Heart className="w-4 h-4" />
      case 'gastronômico':
        return <Utensils className="w-4 h-4" />
      case 'natalino':
        return <Sparkles className="w-4 h-4" />
      case 'cultural':
        return <Camera className="w-4 h-4" />
      case 'negócios':
        return <Users className="w-4 h-4" />
      case 'esportivo':
        return <Star className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getCategoriaImage = (categoria, eventoId = null) => {
    // Banco expandido de imagens específicas por categoria com múltiplas opções
    const imageBank = {
      'musical': [
        '1493225457124-a3eb5c1c8d7d', // Concert stage with lights
        '1501386761578-f9fcd7c96c5b', // Band performing
        '1571068316344-7dd2c0ac8e62', // Live music crowd
        '1514525253161-a9d14804e1b3', // Music festival
        '1493225457124-a3eb5c1c8d7d', // DJ performance
        '1571068316344-7dd2c0ac8e62', // Orchestra
        '1501386761578-f9fcd7c96c5b', // Singer on stage
        '1514525253161-a9d14804e1b3'  // Music venue
      ],
      'forró': [
        '1571068316344-7dd2c0ac8e62', // Folk dance
        '1493225457124-a3eb5c1c8d7d', // Traditional music
        '1501386761578-f9fcd7c96c5b', // Accordion player
        '1514525253161-a9d14804e1b3', // Regional celebration
        '1571068316344-7dd2c0ac8e62', // Cultural festival
        '1493225457124-a3eb5c1c8d7d', // Couples dancing
        '1501386761578-f9fcd7c96c5b', // Street party
        '1514525253161-a9d14804e1b3'  // Traditional costume
      ],
      'gospel': [
        '1507003211169-0a1dd7228f2d', // Church choir singing
        '1438232992991-0b8fa8cc3ddc', // Worship service
        '1520637836862-4d197d17c23a', // Gospel concert
        '1507003211169-0a1dd7228f2d', // Church interior
        '1438232992991-0b8fa8cc3ddc', // Prayer meeting
        '1520637836862-4d197d17c23a', // Christian gathering
        '1507003211169-0a1dd7228f2d', // Spiritual event
        '1438232992991-0b8fa8cc3ddc'  // Faith community
      ],
      'religioso': [
        '1438232992991-0b8fa8cc3ddc', // Beautiful church
        '1507003211169-0a1dd7228f2d', // People praying
        '1520637836862-4d197d17c23a', // Religious ceremony
        '1438232992991-0b8fa8cc3ddc', // Cathedral interior
        '1507003211169-0a1dd7228f2d', // Spiritual gathering
        '1520637836862-4d197d17c23a', // Religious festival
        '1438232992991-0b8fa8cc3ddc', // Sacred space
        '1507003211169-0a1dd7228f2d'  // Community worship
      ],
      'gastronômico': [
        '1555939594-f7405c036bc2', // Elegant restaurant
        '1504674900247-0877df9cc836', // Food festival
        '1414235077428-338989a2e8c0', // Chef cooking
        '1555939594-f7405c036bc2', // Fine dining
        '1504674900247-0877df9cc836', // Street food
        '1414235077428-338989a2e8c0', // Kitchen scene
        '1555939594-f7405c036bc2', // Wine tasting
        '1504674900247-0877df9cc836'  // Culinary arts
      ],
      'natalino': [
        '1512389142860-9c449e58a543', // Christmas lights
        '1544273455-4e1b7e3c7b7a', // Holiday decorations
        '1512389142860-9c449e58a543', // Christmas tree
        '1544273455-4e1b7e3c7b7a', // Winter wonderland
        '1512389142860-9c449e58a543', // Holiday market
        '1544273455-4e1b7e3c7b7a', // Christmas celebration
        '1512389142860-9c449e58a543', // Festive gathering
        '1544273455-4e1b7e3c7b7a'  // Holiday spirit
      ],
      'cultural': [
        '1541961017571-139a7d7ddd6b', // Art gallery
        '1518998053901-5348d3961a04', // Museum exhibition
        '1541961017571-139a7d7ddd6b', // Cultural center
        '1518998053901-5348d3961a04', // Theater performance
        '1541961017571-139a7d7ddd6b', // Art installation
        '1518998053901-5348d3961a04', // Cultural festival
        '1541961017571-139a7d7ddd6b', // Historic venue
        '1518998053901-5348d3961a04'  // Artistic event
      ],
      'negócios': [
        '1552664730-d307ca04f8a5', // Business conference
        '1560472354-b33ff0c44a5a', // Modern meeting room
        '1552664730-d307ca04f8a5', // Professional event
        '1560472354-b33ff0c44a5a', // Corporate gathering
        '1552664730-d307ca04f8a5', // Business networking
        '1560472354-b33ff0c44a5a', // Executive meeting
        '1552664730-d307ca04f8a5', // Trade show
        '1560472354-b33ff0c44a5a'  // Business seminar
      ],
      'esportivo': [
        '1571019613454-1cb2f99b2d8b', // Stadium view
        '1574680178582-a4d7c6d6b8a3', // Sports event
        '1571019613454-1cb2f99b2d8b', // Athletic competition
        '1574680178582-a4d7c6d6b8a3', // Sports venue
        '1571019613454-1cb2f99b2d8b', // Game day
        '1574680178582-a4d7c6d6b8a3', // Sports arena
        '1571019613454-1cb2f99b2d8b', // Championship
        '1574680178582-a4d7c6d6b8a3'  // Athletic event
      ],
      'educacional': [
        '1503676260728-1c00da094a0b', // Modern classroom
        '1523050854560-000ac33fc7cc', // Students learning
        '1503676260728-1c00da094a0b', // Educational workshop
        '1523050854560-000ac33fc7cc', // School event
        '1503676260728-1c00da094a0b', // Academic conference
        '1523050854560-000ac33fc7cc', // Training session
        '1503676260728-1c00da094a0b', // Learning environment
        '1523050854560-000ac33fc7cc'  // Educational seminar
      ],
      'tecnologia': [
        '1518709268508-07ab52d3d73e', // Technology setup
        '1531297484001-80c75c6e2e15', // Innovation hub
        '1518709268508-07ab52d3d73e', // Tech conference
        '1531297484001-80c75c6e2e15', // Digital event
        '1518709268508-07ab52d3d73e', // Tech meetup
        '1531297484001-80c75c6e2e15', // Startup event
        '1518709268508-07ab52d3d73e', // Tech expo
        '1531297484001-80c75c6e2e15'  // Innovation showcase
      ],
      'saúde': [
        '1559757148-9e5e7c24f9eb', // Healthcare facility
        '1576091160399-c745ef9394d1', // Medical conference
        '1559757148-9e5e7c24f9eb', // Health seminar
        '1576091160399-c745ef9394d1', // Wellness event
        '1559757148-9e5e7c24f9eb', // Health expo
        '1576091160399-c745ef9394d1', // Medical workshop
        '1559757148-9e5e7c24f9eb', // Health fair
        '1576091160399-c745ef9394d1'  // Wellness conference
      ],
      'infantil': [
        '1503454537195-1dcabb73ffb9', // Children playing
        '1558618047-3c512c6991f1', // Kids party
        '1503454537195-1dcabb73ffb9', // Playground fun
        '1558618047-3c512c6991f1', // Children's event
        '1503454537195-1dcabb73ffb9', // Family activity
        '1558618047-3c512c6991f1', // Kids entertainment
        '1503454537195-1dcabb73ffb9', // Children's festival
        '1558618047-3c512c6991f1'  // Family gathering
      ],
      'default': [
        '1492684223066-81342ee5ff30', // General celebration
        '1511795409834-ef04bbd61622', // Social gathering
        '1492684223066-81342ee5ff30', // Community event
        '1511795409834-ef04bbd61622', // Public celebration
        '1492684223066-81342ee5ff30', // Festival atmosphere
        '1511795409834-ef04bbd61622', // People celebrating
        '1492684223066-81342ee5ff30', // Event venue
        '1511795409834-ef04bbd61622'  // Social event
      ]
    }
    
    const categoria_key = categoria.toLowerCase()
    const images = imageBank[categoria_key] || imageBank['default']
    
    // Usar ID do evento para selecionar imagem específica, garantindo variedade
    let imageIndex = 0
    if (eventoId) {
      // Criar hash simples do ID para distribuir uniformemente
      const hash = eventoId.toString().split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      imageIndex = Math.abs(hash) % images.length
    } else {
      imageIndex = Math.floor(Math.random() * images.length)
    }
    
    const imageId = images[imageIndex]
    return `https://images.unsplash.com/photo-${imageId}?w=800&h=600&fit=crop&crop=center&q=80`
  }

  // Função para fallback usando Picsum Photos
  const getFallbackImage = (width = 800, height = 600) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`
  }

  // Função para obter imagem específica de notícia
  const getImagemNoticia = (noticia, index) => {
    // Detectar tipo de evento baseado no título do evento em destaque
    const eventoTipo = eventoDestaque?.categoria?.toLowerCase() || 'musical'
    
    const bancoImagens = {
      gospel: [
        '1507003211169-0a1dd7228f2d', // Church choir singing
        '1438232992991-0b8fa8cc3ddc', // Worship service
        '1520637836862-4d197d17c23a', // Gospel concert
        '1506905925327-d89e4b0c8bef', // Worship hands raised
        '1545558014-8692077e9b5c'  // Gospel band performing
      ],
      musical: [
        '1493225457124-a3eb5c1c8d7d', // Concert stage with lights
        '1501386761578-f9fcd7c96c5b', // Band performing
        '1571068316344-7dd2c0ac8e62', // Live music crowd
        '1514525253161-a9d14804e1b3', // Music festival stage
        '1520523739897-94dde4e15e2a', // Festival crowd
        '1516450360452-9312f5e6f35f', // Outdoor concert
        '1493225457124-a3eb5c1c8d7d', // Music festival at night
        '1540039740218-3edc5b044e20'  // Music festival performance
      ],
      forró: [
        '1571068316344-7dd2c0ac8e62', // Folk dance
        '1493225457124-a3eb5c1c8d7d', // Traditional music
        '1501386761578-f9fcd7c96c5b', // Accordion player
        '1514525253161-a9d14804e1b3', // Regional celebration
        '1571068316344-7dd2c0ac8e62'  // Cultural festival
      ]
    }
    
    // Selecionar banco de imagens apropriado
    const imagens = bancoImagens[eventoTipo] || bancoImagens.musical
    
    // Selecionar imagem baseada no índice da notícia
    const imageId = imagens[index % imagens.length]
    return `https://images.unsplash.com/photo-${imageId}?w=800&h=400&fit=crop&crop=center&q=80`
  }

  const getCategoriaGradient = (categoria) => {
    switch (categoria.toLowerCase()) {
      case 'musical':
      case 'forró':
        return 'from-purple-500 via-pink-500 to-red-500'
      case 'gospel':
        return 'from-blue-400 via-blue-500 to-blue-600'
      case 'religioso':
        return 'from-amber-400 via-orange-500 to-red-500'
      case 'gastronômico':
        return 'from-green-400 via-emerald-500 to-teal-500'
      case 'natalino':
        return 'from-red-500 via-green-500 to-red-600'
      case 'cultural':
        return 'from-indigo-400 via-purple-500 to-pink-500'
      case 'negócios':
        return 'from-gray-600 via-gray-700 to-gray-800'
      case 'esportivo':
        return 'from-orange-400 via-red-500 to-pink-500'
      default:
        return 'from-blue-400 via-purple-500 to-pink-500'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'em_andamento':
        return <Badge className="bg-green-500 text-white animate-pulse px-2 py-1 text-xs font-semibold mb-6 inline-block">🔴 AO VIVO</Badge>
      case 'programado':
        return <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold mb-6 inline-block">📅 PROGRAMADO</Badge>
      case 'finalizado':
        return <Badge className="bg-gray-500 text-white px-2 py-1 text-xs font-semibold mb-6 inline-block">✅ FINALIZADO</Badge>
      default:
        return <Badge className="px-2 py-1 text-xs font-semibold mb-6 inline-block">📋 EVENTO</Badge>
    }
  }

  const getTipoLocal = (tipo) => {
    const tipos = {
      'palco_principal': '🎤 Palco Principal',
      'show_especial': '🎭 Show Especial',
      'local_religioso': '⛪ Local Religioso',
      'concentracao': '📍 Concentração',
      'percurso': '🚶 Percurso',
      'destino': '🎯 Destino',
      'alimentacao': '🍽️ Alimentação',
      'entretenimento_infantil': '🎪 Kids'
    }
    return tipos[tipo] || `📍 ${tipo}`
  }

  // Filtros para notícias
  const categoriasnoticias = ['todas', ...new Set(noticiasData.map(n => n.categoria))]
  const autores = ['todos', ...new Set(noticiasData.map(n => n.autor))]
  
  const noticiasFiltradas = noticiasData.filter(noticia => {
    const matchBusca = noticia.titulo.toLowerCase().includes(buscaNoticias.toLowerCase()) ||
                      noticia.resumo.toLowerCase().includes(buscaNoticias.toLowerCase()) ||
                      noticia.autor.toLowerCase().includes(buscaNoticias.toLowerCase())
    
    const matchCategoria = filtroCategoriaNoticias === 'todas' || noticia.categoria === filtroCategoriaNoticias
    const matchAutor = filtroAutor === 'todos' || noticia.autor === filtroAutor
    
    return matchBusca && matchCategoria && matchAutor
  }).sort((a, b) => {
    switch (ordenacao) {
      case 'mais-recentes':
        return new Date(b.data) - new Date(a.data)
      case 'mais-antigos':
        return new Date(a.data) - new Date(b.data)
      case 'alfabetico':
        return a.titulo.localeCompare(b.titulo)
      case 'categoria':
        return a.categoria.localeCompare(b.categoria)
      default:
        return 0
    }
  })

  // Componente da página de notícias
  const PaginaNoticias = () => {
    const getImagemNoticiaCompleta = (categoria, index) => {
      const imageBank = {
        'Festival': ['1493225457124-a3eb5c1c8d7d', '1571068316344-7dd2c0ac8e62'],
        'Lançamento': ['1552664730-d307ca04f8a5', '1560472354-b33ff0c44a5a'],
        'Segurança': ['1550745165-2d5a5170fa7f', '1571019613454-1cb2f99b2d8b'],
        'Tecnologia': ['1518709268508-07ab52d3d73e', '1531297484001-80c75c6e2e15'],
        'Tradição': ['1571068316344-7dd2c0ac8e62', '1493225457124-a3eb5c1c8d7d'],
        'Cultura': ['1541961017571-139a7d7ddd6b', '1518998053901-5348d3961a04'],
        'Turismo': ['1506905925327-d89e4b0c8bef', '1545558014-8692077e9b5c'],
        'Transporte': ['1570825461953-4b4c4f4e4b4b', '1540039740218-3edc5b044e20'],
        'Gastronomia': ['1555939594-f7405c036bc2', '1504674900247-0877df9cc836'],
        'Social': ['1559757148-9e5e7c24f9eb', '1576091160399-c745ef9394d1'],
        'Economia': ['1552664730-d307ca04f8a5', '1560472354-b33ff0c44a5a']
      }
      
      const images = imageBank[categoria] || imageBank['Festival']
      const imageId = images[index % images.length]
      return `https://images.unsplash.com/photo-${imageId}?w=400&h=250&fit=crop&crop=center&q=80`
    }

    const getCategoriaColor = (categoria) => {
      const cores = {
        'Festival': 'bg-purple-500 text-white',
        'Lançamento': 'bg-blue-500 text-white',
        'Segurança': 'bg-red-500 text-white',
        'Tecnologia': 'bg-green-500 text-white',
        'Tradição': 'bg-orange-500 text-white',
        'Cultura': 'bg-indigo-500 text-white',
        'Turismo': 'bg-cyan-500 text-white',
        'Transporte': 'bg-yellow-500 text-white',
        'Gastronomia': 'bg-pink-500 text-white',
        'Social': 'bg-emerald-500 text-white',
        'Economia': 'bg-slate-500 text-white'
      }
      return cores[categoria] || 'bg-gray-500 text-white'
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Hero Section da Página de Notícias */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
                Central de Notícias
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Fique por dentro de tudo que acontece nos eventos de Garanhuns
              </p>
              <div className="flex items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-6 h-6" />
                  <span>{noticiasData.length} Notícias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  <span>{autores.length - 1} Autores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  <span>{categoriasnoticias.length - 1} Categorias</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Barra de Filtros Avançados */}
        <section className="py-8 bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {/* Busca */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notícias, autores..."
                    value={buscaNoticias}
                    onChange={(e) => setBuscaNoticias(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtro de Categoria */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={filtroCategoriaNoticias}
                    onChange={(e) => setFiltroCategoriaNoticias(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    {categoriasnoticias.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria === 'todas' ? 'Todas as categorias' : categoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro de Autor */}
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={filtroAutor}
                    onChange={(e) => setFiltroAutor(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    {autores.map(autor => (
                      <option key={autor} value={autor}>
                        {autor === 'todos' ? 'Todos os autores' : autor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordenação */}
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="mais-recentes">Mais recentes</option>
                    <option value="mais-antigos">Mais antigos</option>
                    <option value="alfabetico">Alfabético</option>
                    <option value="categoria">Por categoria</option>
                  </select>
                </div>
              </div>

              {/* Estatísticas dos filtros */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBuscaNoticias('')
                      setFiltroCategoriaNoticias('todas')
                      setFiltroAutor('todos')
                      setOrdenacao('mais-recentes')
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {noticiasFiltradas.length} notícia{noticiasFiltradas.length !== 1 ? 's' : ''} encontrada{noticiasFiltradas.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Notícias */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {noticiasFiltradas.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Nenhuma notícia encontrada</h3>
                <p className="text-muted-foreground mb-6">
                  Tente ajustar os filtros ou usar termos de busca diferentes.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setBuscaNoticias('')
                    setFiltroCategoriaNoticias('todas')
                    setFiltroAutor('todos')
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {noticiasFiltradas.map((noticia, index) => (
                  <Card key={noticia.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden bg-white border-0 shadow-lg">
                    {/* Imagem da notícia */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={getImagemNoticiaCompleta(noticia.categoria, index)}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = getFallbackImage(400, 250)
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Badge de categoria */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoriaColor(noticia.categoria)} px-3 py-1 text-xs font-bold rounded-lg shadow-lg`}>
                          {noticia.categoria}
                        </Badge>
                      </div>
                      
                      {/* Badge de destaque */}
                      {noticia.destaque && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-red-500 text-white animate-pulse px-3 py-1 text-xs font-bold rounded-lg shadow-lg">
                            ⭐ DESTAQUE
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {noticia.titulo}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-6">
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {noticia.resumo}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatarDataCurta(noticia.data)}</span>
                        </div>
                        <span className="font-medium">{noticia.autor}</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full group-hover:shadow-lg transition-all duration-300"
                        onClick={() => setNoticiaDestaque(noticia)}
                      >
                        <Newspaper className="w-4 h-4 mr-2" />
                        Ler Matéria Completa
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Modal de Notícia Detalhada */}
        {noticiaDestaque && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {/* Imagem de destaque */}
                <div className="h-64 md:h-80 relative overflow-hidden rounded-t-xl">
                  <img 
                    src={getImagemNoticiaCompleta(noticiaDestaque.categoria, 0)}
                    alt={noticiaDestaque.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Botão fechar */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                    onClick={() => setNoticiaDestaque(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  
                  {/* Badges */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Badge className={`${getCategoriaColor(noticiaDestaque.categoria)} px-3 py-1 text-sm font-bold rounded-lg`}>
                      {noticiaDestaque.categoria}
                    </Badge>
                    {noticiaDestaque.destaque && (
                      <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-lg">
                        ⭐ DESTAQUE
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Conteúdo da notícia */}
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                    {noticiaDestaque.titulo}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatarDataCurta(noticiaDestaque.data)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{noticiaDestaque.autor}</span>
                    </div>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                      {noticiaDestaque.resumo}
                    </p>
                    
                    {/* Conteúdo expandido da notícia */}
                    <div className="space-y-4 text-foreground">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button 
                      onClick={() => setNoticiaDestaque(null)}
                      className="w-full md:w-auto"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!eventoDestaque) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      </div>
    )
  }

  // Renderizar a página correta baseada no estado
  if (paginaAtual === 'test-api') {
    return <TestPage />;
  }

  if (paginaAtual === 'noticias') {
    return (
      <div className="min-h-screen bg-background">
        {/* Injetar estilos customizados no head */}
        <style dangerouslySetInnerHTML={{ __html: stickyStyles }} />
        
        {/* Cabeçalho com z-index corrigido */}
        <header className="header-sticky fixed top-0 w-full bg-white border-b border-border shadow-sm z-[100]">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl sm:text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Eventos Garanhuns
                </h1>
                <div className="flex items-center space-x-2">
                  {apiStatus.isOnline ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Database className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <Database className="w-3 h-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Menu Desktop */}
              <nav className="hidden md:flex items-center space-x-6">
                <Button 
                  variant={paginaAtual === 'home' ? 'default' : 'ghost'}
                  onClick={() => setPaginaAtual('home')}
                  className="flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Eventos</span>
                </Button>
                <Button 
                  variant={paginaAtual === 'noticias' ? 'default' : 'ghost'}
                  onClick={() => setPaginaAtual('noticias')}
                  className="flex items-center space-x-2"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Notícias</span>
                </Button>
                <Button 
                  variant={paginaAtual === 'test-api' ? 'default' : 'ghost'}
                  onClick={() => setPaginaAtual('test-api')}
                  className="flex items-center space-x-2"
                >
                  <Database className="w-4 h-4" />
                  <span>API Status</span>
                </Button>
              </nav>

              {/* Menu Mobile */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="menu-toggle-btn p-2"
                  onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                >
                  {menuMobileAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
                
                {menuMobileAberto && (
                  <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg mobile-menu-open z-50">
                    <div className="container mx-auto px-4 py-4">
                      <nav className="flex flex-col space-y-3">
                        <Button 
                          variant={paginaAtual === 'home' ? 'default' : 'ghost'}
                          onClick={() => {
                            setPaginaAtual('home')
                            setMenuMobileAberto(false)
                          }}
                          className="justify-start mobile-menu-item"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Eventos
                        </Button>
                        <Button 
                          variant={paginaAtual === 'noticias' ? 'default' : 'ghost'}
                          onClick={() => {
                            setPaginaAtual('noticias')
                            setMenuMobileAberto(false)
                          }}
                          className="justify-start mobile-menu-item"
                        >
                          <Newspaper className="w-4 h-4 mr-2" />
                          Notícias
                        </Button>
                        <Button 
                          variant={paginaAtual === 'test-api' ? 'default' : 'ghost'}
                          onClick={() => {
                            setPaginaAtual('test-api')
                            setMenuMobileAberto(false)
                          }}
                          className="justify-start mobile-menu-item"
                        >
                          <Database className="w-4 h-4 mr-2" />
                          API Status
                        </Button>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Menu Mobile Retrátil */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white border-t ${
          menuMobileAberto ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="container mx-auto px-1 sm:px-6 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setPaginaAtual('home')
                  setMenuMobileAberto(false)
                }}
                className={`flex items-center gap-3 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-muted ${paginaAtual === 'home' ? 'text-primary bg-muted' : 'text-foreground hover:text-primary'}`}
              >
                <Star className="w-5 h-5" />
                <span>Evento em Destaque</span>
              </button>
              <a 
                href="#todos-eventos" 
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                onClick={() => setMenuMobileAberto(false)}
              >
                <Calendar className="w-5 h-5" />  
                <span>Todos os Eventos</span>
              </a>
              <button 
                onClick={() => {
                  setPaginaAtual('noticias')
                  setMenuMobileAberto(false)
                }}
                className={`flex items-center gap-3 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-muted ${paginaAtual === 'noticias' ? 'text-primary bg-muted' : 'text-foreground hover:text-primary'}`}
              >
                <Newspaper className="w-5 h-5" />
                <span>Notícias</span>
              </button>
              <button 
                onClick={() => {
                  setPaginaAtual('test-api')
                  setMenuMobileAberto(false)
                }}
                className={`flex items-center gap-3 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-muted ${paginaAtual === 'test-api' ? 'text-primary bg-muted' : 'text-foreground hover:text-primary'}`}
              >
                <Database className="w-5 h-5" />
                <span>API Teste</span>
              </button>
              <a 
                href="#contato" 
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                onClick={() => setMenuMobileAberto(false)}
              >
                <Phone className="w-5 h-5" />
                <span>Contato</span>
              </a>
              
              {/* Ações rápidas no menu mobile */}
              <div className="border-t pt-4 mt-2">
                <Button
                  variant={mostrarFavoritos ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setMostrarFavoritos(!mostrarFavoritos)
                    setMenuMobileAberto(false)
                    setPaginaAtual('home')
                    // Scroll para seção de eventos
                    setTimeout(() => {
                      document.getElementById('todos-eventos')?.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }}
                  className="w-full flex items-center gap-2 justify-start"
                >
                  <Heart className={`w-4 h-4 ${mostrarFavoritos ? 'fill-current' : ''}`} />
                  {mostrarFavoritos ? 'Ver Todos os Eventos' : 'Meus Favoritos'}
                  {mostrarFavoritos && eventosFavoritos.size > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {eventosFavoritos.size}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </nav>
        </div>

        <PaginaNoticias />
      </div>
    )
  }

  return (
          <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-[100] header-sticky">
          <div className="container mx-auto px-1 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-lg sm:text-2xl font-bold text-foreground font-display">
                <span className="hidden sm:inline">Portal de Eventos Garanhuns</span>
                <span className="sm:hidden">Eventos GNS</span>
              </h1>
            </div>
            
            {/* Menu Desktop */}
            <nav className="hidden md:flex space-x-6 items-center">
              <button 
                onClick={() => setPaginaAtual('home')} 
                className={`transition-colors font-medium ${paginaAtual === 'home' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Evento em Destaque
              </button>
              <a href="#todos-eventos" className="text-foreground hover:text-primary transition-colors">Todos os Eventos</a>
              <button 
                onClick={() => setPaginaAtual('noticias')} 
                className={`transition-colors font-medium ${paginaAtual === 'noticias' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Notícias
              </button>
              <button 
                onClick={() => setPaginaAtual('test-api')} 
                className={`transition-colors font-medium flex items-center gap-1 ${paginaAtual === 'test-api' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                <Database className="w-4 h-4" />
                API Teste
              </button>
              <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
              <NotificationSystem eventos={eventos} eventosFavoritos={eventosFavoritos} />
            </nav>

            {/* Botão Menu Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <NotificationSystem eventos={eventos} eventosFavoritos={eventosFavoritos} />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuMobileAberto(!menuMobileAberto)
                }}
                className="p-2 menu-toggle-btn"
              >
                {menuMobileAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Retrátil */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white border-t ${
          menuMobileAberto ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}>
                    <nav className="container mx-auto px-1 sm:px-6 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setPaginaAtual('home')
                  setMenuMobileAberto(false)
                }}
                className={`flex items-center gap-3 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-muted ${paginaAtual === 'home' ? 'text-primary bg-muted' : 'text-foreground hover:text-primary'}`}
              >
                <Star className="w-5 h-5" />
                <span>Evento em Destaque</span>
              </button>
              <a 
                href="#todos-eventos" 
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                onClick={() => setMenuMobileAberto(false)}
              >
                <Calendar className="w-5 h-5" />  
                <span>Todos os Eventos</span>
              </a>
              <button 
                onClick={() => {
                  setPaginaAtual('noticias')
                  setMenuMobileAberto(false)
                }}
                className={`flex items-center gap-3 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-muted ${paginaAtual === 'noticias' ? 'text-primary bg-muted' : 'text-foreground hover:text-primary'}`}
              >
                <Newspaper className="w-5 h-5" />
                <span>Notícias</span>
              </button>
              <a 
                href="#contato" 
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                onClick={() => setMenuMobileAberto(false)}
              >
                <Phone className="w-5 h-5" />
                <span>Contato</span>
              </a>
              
              {/* Ações rápidas no menu mobile */}
              <div className="border-t pt-4 mt-2">
                <Button
                  variant={mostrarFavoritos ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setMostrarFavoritos(!mostrarFavoritos)
                    setMenuMobileAberto(false)
                    // Scroll para seção de eventos
                    document.getElementById('todos-eventos')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full flex items-center gap-2 justify-start"
                >
                  <Heart className={`w-4 h-4 ${mostrarFavoritos ? 'fill-current' : ''}`} />
                  {mostrarFavoritos ? 'Ver Todos os Eventos' : 'Meus Favoritos'}
                  {mostrarFavoritos && eventosFavoritos.size > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {eventosFavoritos.size}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Evento em Destaque */}
      <section id="evento-destaque" className="relative hero-gradient text-white py-12 overflow-hidden">
        {/* Imagem de fundo relacionada ao evento */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getCategoriaImage(eventoDestaque.categoria, eventoDestaque.id)} 
            alt={`Imagem de ${eventoDestaque.titulo}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = getFallbackImage(1200, 600)
            }}
          />
          {/* Overlay escuro para garantir legibilidade do texto */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Gradiente adicional para manter a identidade visual */}
          <div className="absolute inset-0 hero-gradient opacity-80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            {getStatusBadge(eventoDestaque.statusAtual)}
            <h2 className="text-5xl font-bold mb-4 font-display drop-shadow-lg">{eventoDestaque.titulo}</h2>
            {/* Texto extenso - oculto em mobile */}
            <p className="text-xl mb-6 max-w-3xl mx-auto drop-shadow-md hidden md:block">{eventoDestaque.descricao}</p>
            
            {/* Cards de informações - ocultos em mobile */}
            <div className="flex flex-wrap justify-center gap-6 text-lg hidden md:flex">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <Clock className="w-5 h-5" />
                <span>{formatarData(eventoDestaque.data, eventoDestaque.dataFim)}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <MapPin className="w-5 h-5" />
                <span>{eventoDestaque.local}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <Users className="w-5 h-5" />
                <span>{eventoDestaque.informacoes?.publico_esperado}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de Notícias */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="w-full">
          <div className="text-center mb-6 md:mb-12 px-2 md:px-4">
            <h3 className="text-2xl md:text-5xl font-bold font-display mb-2 md:mb-4 text-gray-900">Últimas Notícias do Evento</h3>
            <p className="text-muted-foreground text-base md:text-2xl max-w-4xl mx-auto">Fique por dentro de tudo que acontece no {eventoDestaque?.titulo || 'evento'}</p>
            <div className="w-16 md:w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 md:mt-8 rounded-full"></div>
          </div>
          

          
          {/* Carrossel de Notícias */}
          {eventoDestaque?.noticias && eventoDestaque.noticias.length > 0 && (
            <div className="px-4">
              <NewsCarousel 
                noticias={eventoDestaque.noticias}
                autoPlay={true}
                interval={6000}
              />
            </div>
          )}
        </div>
      </section>

      {/* Layout principal de duas colunas: Conteúdo à esquerda, Notícias gerais à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 bg-gradient-to-b from-muted/30 to-background min-h-screen">
        {/* Coluna esquerda - Todo o conteúdo principal (3/4) */}
        <div className="lg:col-span-3 space-y-8 pb-8">
          
          {/* Seção de Eventos da Semana */}
          <section className="py-12 bg-muted/10">
            <div className="container mx-auto px-1 sm:px-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold font-display mb-3">Eventos da Semana</h3>
                <p className="text-muted-foreground text-lg">Descubra os eventos programados desde hoje até domingo</p>
              </div>
          
          {(() => {
            const eventosDaSemana = getEventosDaSemana(eventos);
            
            if (eventosDaSemana.length === 0) {
              return (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Nenhum evento programado</h4>
                  <p className="text-muted-foreground">Não há eventos programados para esta semana</p>
                </div>
              );
            }
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {eventosDaSemana.map((evento) => (
                  <Card key={evento.id} className="event-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                    {/* Imagem do Evento */}
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={getCategoriaImage(evento.categoria, evento.id)} 
                        alt={evento.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.src = getFallbackImage(800, 600)
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${getCategoriaGradient(evento.categoria)} opacity-20`}></div>
                      
                      {/* Badges sobrepostos na imagem */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className="event-badge-category px-2 py-1 text-xs rounded-md backdrop-blur-sm bg-white/90 text-gray-800 shadow-lg flex items-center gap-1">
                          {getCategoriaIcon(evento.categoria)}
                          {evento.categoria}
                        </Badge>
                        <Badge 
                          className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 backdrop-blur-sm shadow-lg ${
                            evento.tipo === 'publico' 
                              ? 'bg-emerald-500/90 text-white' 
                              : 'bg-blue-600/90 text-white'
                          }`}
                        >
                          {evento.tipo === 'publico' ? (
                            <>
                              <Star className="w-2 h-2" />
                              PUB
                            </>
                          ) : (
                            <>
                              <Users className="w-2 h-2" />
                              PRIV
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2 px-4 pt-3">
                      {/* Título sem descrição para evitar duplicação com o hero */}
                      <div className="space-y-2">
                        <CardTitle className="text-base font-display line-clamp-2 leading-tight font-bold">
                          {evento.titulo}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-4 pb-3">
                      {/* Informações do evento com melhor espaçamento */}
                      <div className="space-y-2 text-xs mb-3">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                          <span className="font-medium">{formatarData(evento.data, evento.dataFim)}</span>
                        </div>
                        {evento.horario && (
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                            <span>{evento.horario}</span>
                          </div>
                        )}
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                          <span className="line-clamp-1">{evento.local}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                          <span>{evento.informacoes?.publico_esperado || 'Não informado'}</span>
                        </div>
                      </div>
                      
                      {/* Footer do card com melhor alinhamento */}
                      <div className="flex items-center justify-between pt-2 border-t border-border event-divider">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getCategoriaIcon(evento.categoria)}
                          </div>
                          <span className="event-price font-semibold text-xs">{evento.preco}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="event-details-btn text-xs px-4 py-2"
                          onClick={() => setEventoDestaque({...evento, statusAtual: getStatusEvento(evento)})}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Container do Evento em Destaque */}
      {eventoDestaque && (
      <div className="event-detail-container bg-white rounded-xl p-3 sm:p-8 mx-2 sm:mx-6 mb-6 sm:mb-8 relative border-2 border-gray-200 shadow-lg">
        {/* Badge de Destaque */}
        <div className="absolute -top-3 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg z-10">
          ⭐ EVENTO EM DESTAQUE
        </div>

        {/* Header Principal do Evento */}
        <div className="event-tabs-header rounded-t-xl overflow-hidden mb-4 sm:mb-8 mt-4">
          {/* Imagem de Hero do Evento em Destaque */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <img 
                src={getCategoriaImage(eventoDestaque.categoria, eventoDestaque.id)} 
                alt={eventoDestaque.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = getFallbackImage(1200, 800)
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            {/* Conteúdo sobreposto na imagem */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 sm:space-y-6 px-4 sm:px-6">
                {/* Título Principal com Visual Aprimorado */}
                <div className="relative">
                  <div className="text-center mb-2 sm:mb-4">
                    <h2 className="text-xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                        {eventoDestaque.titulo}
                    </h2>
                  </div>
                  
                  {/* Linha decorativa */}
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-3 sm:mb-6"></div>
                </div>
                
                {/* Badges com Melhor Hierarquia */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="event-badge-category px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 backdrop-blur-sm bg-white/20 text-white border border-white/30 text-xs sm:text-sm rounded-lg">
                      {getCategoriaIcon(eventoDestaque.categoria)}
                      {eventoDestaque.categoria}
                  </span>
                    <span className={`event-badge-private px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 backdrop-blur-sm ${eventoDestaque.tipo === 'publico' ? 'bg-green-600/80' : 'bg-blue-600/80'} text-white border border-white/30 text-xs sm:text-sm rounded-lg`}>
                    <Users className="w-3 h-3" />
                      {eventoDestaque.tipo === 'publico' ? 'PÚBLICO' : 'PRIVADO'}
                  </span>
                    {getStatusBadge(eventoDestaque.statusAtual)}
                </div>
                
                {/* Descrição removida para evitar duplicação */}
              </div>
            </div>
          </div>
          
                     {/* Informações Rápidas com Cards - ocultos em mobile */}
           <div className="p-3 sm:p-8 hidden md:block">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm text-gray-500 font-medium">Período</div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatarData(eventoDestaque.data, eventoDestaque.dataFim)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm text-gray-500 font-medium">Local</div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {eventoDestaque.local || 'Local a definir'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm text-gray-500 font-medium">Tipo</div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {eventoDestaque.tipo === 'publico' ? 'Evento Público' : 'Evento Privado'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status e CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-200">
              <div className={`flex items-center gap-2 ${
                eventoDestaque.statusAtual === 'inscricoes_abertas' ? 'text-green-600' : 
                eventoDestaque.statusAtual === 'acontecendo' ? 'text-blue-600' : 
                eventoDestaque.statusAtual === 'finalizado' ? 'text-gray-600' : 'text-orange-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  eventoDestaque.statusAtual === 'inscricoes_abertas' ? 'bg-green-500 animate-pulse' : 
                  eventoDestaque.statusAtual === 'acontecendo' ? 'bg-blue-500 animate-pulse' : 
                  eventoDestaque.statusAtual === 'finalizado' ? 'bg-gray-500' : 'bg-orange-500'
                }`}></div>
                <span className="text-xs sm:text-sm font-semibold">
                  {eventoDestaque.statusAtual === 'inscricoes_abertas' ? 'Inscrições Abertas' : 
                   eventoDestaque.statusAtual === 'acontecendo' ? 'Acontecendo Agora' : 
                   eventoDestaque.statusAtual === 'finalizado' ? 'Evento Finalizado' : 'Em Breve'}
                </span>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 sm:px-6 py-1.5 sm:py-2 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Inscrever-se Agora
              </Button>
            </div>
          </div>
        </div>

        {/* Navegação das Abas */}
        <div className="tab-navigation bg-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 mx-1 sm:mx-6 mb-4 sm:mb-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('programacao')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 relative overflow-hidden text-xs sm:text-sm ${
                activeTab === 'programacao'
                  ? 'tab-active text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
              }`}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline font-semibold">Programação</span>
              <span className="sm:hidden font-semibold">Prog</span>
              {activeTab === 'programacao' && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 -z-10 rounded-xl"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('locais')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 relative overflow-hidden text-xs sm:text-sm ${
                activeTab === 'locais'
                  ? 'tab-active text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
              }`}
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline font-semibold">Locais</span>
              <span className="sm:hidden font-semibold">Loc</span>
              {activeTab === 'locais' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 -z-10 rounded-xl"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('noticias')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 relative overflow-hidden text-xs sm:text-sm ${
                activeTab === 'noticias'
                  ? 'tab-active text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
              }`}
            >
              <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline font-semibold">Notícias</span>
              <span className="sm:hidden font-semibold">News</span>
              {activeTab === 'noticias' && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 -z-10 rounded-xl"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('informacoes')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 relative overflow-hidden text-xs sm:text-sm ${
                activeTab === 'informacoes'
                  ? 'tab-active text-white shadow-lg'
                  : 'bg-transparent text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
              }`}
            >
              <Info className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline font-semibold">Informações</span>
              <span className="sm:hidden font-semibold">Info</span>
              {activeTab === 'informacoes' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 -z-10 rounded-xl"></div>
              )}
            </button>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm tab-content">
          {activeTab === 'programacao' && (
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {(() => {
                  // Função para processar e estruturar a programação
                  const processarProgramacao = () => {
                    const descricao = eventoDestaque.descricaoCompleta || eventoDestaque.descricao || '';
                    
                    // Detectar se é um evento com múltiplos polos (Festival de Inverno)
                    const temPolos = descricao.toLowerCase().includes('polo') || 
                                   descricao.toLowerCase().includes('palco') ||
                                   descricao.toLowerCase().includes('praça');
                    
                    if (!temPolos) {
                      // Evento simples - exibir descrição formatada
                      return (
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                          <div 
                            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                            style={{
                              whiteSpace: 'pre-line',
                              lineHeight: '1.6',
                            }}
                          >
                            {descricao}
                          </div>
                        </div>
                      );
                    }
                    
                    // Evento complexo com polos - estruturar a programação
                    const linhas = descricao.split('\n').filter(linha => linha.trim());
                    const polos = [];
                    let poloAtual = null;
                    let diaAtual = null;
                    
                    linhas.forEach(linha => {
                      const linhaTrim = linha.trim();
                      
                      // Detectar início de um novo polo/palco/local
                      if (linhaTrim.toLowerCase().includes('polo') || 
                          linhaTrim.toLowerCase().includes('palco') ||
                          linhaTrim.toLowerCase().includes('praça') ||
                          linhaTrim.toLowerCase().includes('espaço') ||
                          linhaTrim.match(/^[A-Z\s]+:$/)) {
                        
                        if (poloAtual) {
                          polos.push(poloAtual);
                        }
                        
                        poloAtual = {
                          nome: linhaTrim.replace(':', '').trim(),
                          dias: []
                        };
                        diaAtual = null;
                        
                      } else if (poloAtual && linhaTrim) {
                        // Detectar início de um novo dia (Quinta-feira, Sexta-feira, etc.)
                        const matchDia = linhaTrim.match(/^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)(?:-feira)?\s*\((\d+)\):\s*$/i);
                        
                        if (matchDia) {
                          diaAtual = {
                            nome: matchDia[1] + (matchDia[1].includes('feira') ? '' : '-feira'),
                            numero: matchDia[2],
                            atracoes: []
                          };
                          poloAtual.dias.push(diaAtual);
                          
                        } else if (diaAtual && linhaTrim.startsWith('-')) {
                          // Atração do dia atual
                          diaAtual.atracoes.push(linhaTrim.substring(1).trim());
                          
                        } else if (linhaTrim.toLowerCase().includes('durante todo') || 
                                   linhaTrim.toLowerCase().includes('informações importantes')) {
                          // Informações gerais do polo
                          if (!poloAtual.informacoes) {
                            poloAtual.informacoes = [];
                          }
                          poloAtual.informacoes.push(linhaTrim);
                          
                        } else if (poloAtual.dias.length === 0) {
                          // Descrição do polo antes dos dias
                          if (!poloAtual.descricao) {
                            poloAtual.descricao = linhaTrim;
                          }
                        }
                      }
                    });
                    
                    // Adicionar último polo
                    if (poloAtual) {
                      polos.push(poloAtual);
                    }
                    
                    // Se não encontrou polos estruturados, criar um polo genérico
                    if (polos.length === 0) {
                      const programacaoGeral = linhas
                        .filter(linha => linha.trim())
                        .map(linha => ({
                          atividade: linha.trim()
                        }));
                      
                      polos.push({
                        nome: 'Programação Geral',
                        dias: [{
                          nome: 'Programação',
                          atracoes: programacaoGeral.map(item => item.atividade)
                        }]
                      });
                    }
                    
                    return (
                      <div className="space-y-3">
                        {polos.map((polo, index) => {
                          const isAberto = poloAbertoIndex === index;
                          
                          return (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                              {/* Header clicável do acordeão */}
                              <button
                                onClick={() => setPoloAbertoIndex(isAberto ? -1 : index)}
                                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="text-lg font-bold text-blue-900">{polo.nome}</h4>
                                    {polo.descricao && (
                                      <p className="text-sm text-blue-700">{polo.descricao}</p>
                                    )}
                                  </div>
                                </div>
                                <div className={`transition-transform duration-200 ${isAberto ? 'rotate-180' : ''}`}>
                                  <ChevronDown className="w-5 h-5 text-blue-600" />
                                </div>
                              </button>
                              
                              {/* Conteúdo do acordeão */}
                              <div className={`transition-all duration-300 ease-in-out ${
                                isAberto 
                                  ? 'max-h-[2000px] opacity-100' 
                                  : 'max-h-0 opacity-0 overflow-hidden'
                              }`}>
                                {polo.dias && polo.dias.length > 0 && (
                                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                      <div className="space-y-4">
                                        {polo.dias.map((dia, diaIndex) => (
                                          <div key={diaIndex} className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                              <div className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-bold flex-shrink-0">
                                                {dia.nome} ({dia.numero})
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                              {dia.atracoes.map((atracao, atracaoIndex) => (
                                                <div key={atracaoIndex} className="flex items-center gap-2 text-gray-700">
                                                  <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                                                  <span className="text-sm">{atracao}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                        
                                        {/* Informações gerais do polo */}
                                        {polo.informacoes && polo.informacoes.length > 0 && (
                                          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                            <h5 className="font-semibold text-orange-800 mb-2">Informações Gerais:</h5>
                                            {polo.informacoes.map((info, infoIndex) => (
                                              <p key={infoIndex} className="text-sm text-orange-700 mb-1">{info}</p>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  };
                  
                  return processarProgramacao();
                })()}
                
                {/* Informações extras se disponíveis */}
                {eventoDestaque.capacidade && (
                  <div className="event-card bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900">Capacidade do Evento</h4>
                        <p className="text-blue-700">Até {eventoDestaque.capacidade.toLocaleString('pt-BR')} pessoas</p>
                      </div>
                    </div>
                  </div>
                )}
                

              </div>
            </div>
          )}

          {activeTab === 'locais' && (
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Localização do Evento
                  </h3>
                  <p className="text-gray-600">
                    Informações detalhadas sobre o local e como chegar
                  </p>
                </div>
                
                <div className="grid gap-4">
                  {/* Local Principal */}
                  <div className="event-card bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{eventoDestaque.local}</h4>
                        {eventoDestaque.endereco_completo && (
                          <p className="text-gray-600 mb-3">
                            📍 {eventoDestaque.endereco_completo.street}{eventoDestaque.endereco_completo.complement ? `, ${eventoDestaque.endereco_completo.complement}` : ''}
                            <br />
                            {eventoDestaque.endereco_completo.neighborhood} - {eventoDestaque.endereco_completo.city}, {eventoDestaque.endereco_completo.state}
                            <br />
                            CEP: {eventoDestaque.endereco_completo.zipcode}
                          </p>
                        )}
                        {eventoDestaque.endereco_completo?.reference && (
                          <p className="text-sm text-gray-500 mb-3">
                            🗺️ Referência: {eventoDestaque.endereco_completo.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Instruções de Localização */}
                  {eventoDestaque.instrucoes_local && (
                    <div className="event-card bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Info className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-blue-900 mb-2">Como Chegar</h4>
                          <p className="text-blue-700">{eventoDestaque.instrucoes_local}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Informações de Acessibilidade */}
                  {eventoDestaque.acessibilidade_info && (
                    <div className="event-card bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Heart className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-green-900 mb-3">Acessibilidade</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {eventoDestaque.acessibilidade_info.wheelchair_accessible && (
                              <div className="flex items-center gap-2 text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Acessível para cadeirantes
                              </div>
                            )}
                            {eventoDestaque.acessibilidade_info.sign_language && (
                              <div className="flex items-center gap-2 text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Tradução em Libras
                              </div>
                            )}
                            {eventoDestaque.acessibilidade_info.accessible_parking && (
                              <div className="flex items-center gap-2 text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Estacionamento acessível
                              </div>
                            )}
                            {eventoDestaque.acessibilidade_info.accessible_bathrooms && (
                              <div className="flex items-center gap-2 text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Banheiros acessíveis
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'noticias' && (
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Últimas Notícias
                  </h3>
                  <p className="text-gray-600">
                    Acompanhe as atualizações e novidades do {eventoDestaque.titulo}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {eventoDestaque.noticias && eventoDestaque.noticias.length > 0 ? (
                    eventoDestaque.noticias.map((noticia, index) => (
                      <div key={noticia.id || index} className="event-card bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            noticia.destaque ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                      <div>
                            <h4 className="font-bold text-gray-900 mb-2">{noticia.titulo}</h4>
                        <p className="text-gray-600 text-sm mb-2">
                              {noticia.resumo}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{noticia.tempo}</span>
                              {noticia.autor && <span>por {noticia.autor}</span>}
                              {noticia.destaque && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">DESTAQUE</span>
                              )}
                      </div>
                    </div>
                  </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma notícia disponível</h4>
                      <p className="text-gray-500">
                        As notícias sobre este evento serão publicadas em breve.
                      </p>
                      </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'informacoes' && (
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Informações Essenciais
                  </h3>
                  <p className="text-gray-600">
                    Tudo que você precisa saber para participar do {eventoDestaque.titulo}
                  </p>
                </div>
                
                <div className="grid gap-4">
                  {/* Informações de Contato */}
                  {eventoDestaque.contato_evento && (
                    <div className="event-card bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-orange-500" />
                        Contatos
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        {eventoDestaque.contato_evento.primary_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>Telefone: {eventoDestaque.contato_evento.primary_phone}</span>
                          </div>
                        )}
                        {eventoDestaque.contato_evento.whatsapp && (
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            <span>WhatsApp: {eventoDestaque.contato_evento.whatsapp}</span>
                          </div>
                        )}
                        {eventoDestaque.contato_evento.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>Email: {eventoDestaque.contato_evento.email}</span>
                          </div>
                        )}
                        {eventoDestaque.contato_evento.emergency_phone && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span>Emergência: {eventoDestaque.contato_evento.emergency_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Informações do Evento */}
                  <div className="event-card bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-orange-500" />
                      Detalhes do Evento
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Período: {formatarData(eventoDestaque.data, eventoDestaque.dataFim)}</span>
                      </div>
                      {eventoDestaque.capacidade && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>Capacidade: {eventoDestaque.capacidade.toLocaleString('pt-BR')} pessoas</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-gray-400" />
                        <span>Entrada: {eventoDestaque.preco}</span>
                      </div>
                      {eventoDestaque.dress_code && (
                        <div className="flex items-center gap-2">
                          <Shirt className="w-4 h-4 text-gray-400" />
                          <span>Dress code: {eventoDestaque.dress_code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Organização */}
                  <div className="event-card bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Building className="w-5 h-5 text-orange-500" />
                      Organização
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• {eventoDestaque.organizador}</div>
                      <div>• Categoria: {eventoDestaque.categoria}</div>
                      <div>• Tipo: Evento Público</div>
                    </div>
                  </div>
                  
                  {/* Informações de Ingresso */}
                  {eventoDestaque.informacoes_ingresso && (
                    <div className="event-card bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-blue-600" />
                        Informações de Ingresso
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        {eventoDestaque.informacoes_ingresso.requirements && (
                          <div>• {eventoDestaque.informacoes_ingresso.requirements}</div>
                        )}
                        {eventoDestaque.informacoes_ingresso.age_restriction && (
                          <div>• Faixa etária: {eventoDestaque.informacoes_ingresso.age_restriction}</div>
                        )}
                        {eventoDestaque.informacoes_ingresso.capacity_limit && (
                          <div>• {eventoDestaque.informacoes_ingresso.capacity_limit}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Seção de Contato de Emergência */}
      <section className="bg-muted/30 py-4 sm:py-8 mx-2 sm:mx-6 rounded-xl border border-gray-300">
        <div className="container mx-auto px-2 sm:px-6">
          <div className="bg-white rounded-lg p-3 sm:p-6 text-center shadow-sm">
            <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-display">Informações e Contato</h4>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-sm sm:text-base">(87) 3761-1000</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-sm sm:text-base">Prefeitura de Garanhuns</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-sm sm:text-base">Emergência: 193</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Todos os Eventos com Filtros Avançados */}
      <section id="todos-eventos" className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-1 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">Todos os Eventos</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubra todos os eventos acontecendo em Garanhuns com nossos filtros avançados
        </p>
      </div>
          
          {/* Barra de Filtros Avançados */}
          <div className="bg-white rounded-xl shadow-sm border p-2 sm:p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos, locais, organizadores..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro de Categoria */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="todos">Todas as categorias</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.nome}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de Tipo */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="publico">🌟 Eventos Públicos</option>
                  <option value="privado">🎫 Eventos Privados</option>
                </select>
              </div>

              {/* Filtro de Preço */}
              <div className="relative">
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={filtroPreco}
                  onChange={(e) => setFiltroPreco(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="todos">Todos os preços</option>
                  <option value="gratuito">💚 Gratuitos</option>
                  <option value="pago">💰 Pagos</option>
                </select>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-3">
                <Button
                  variant={mostrarFavoritos ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${mostrarFavoritos ? 'fill-current' : ''}`} />
                  {mostrarFavoritos ? 'Todos os Eventos' : 'Meus Favoritos'}
                  {mostrarFavoritos && eventosFavoritos.size > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {eventosFavoritos.size}
                    </Badge>
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBusca('')
                    setFiltroCategoria('todos')
                    setFiltroTipo('todos')
                    setFiltroPreco('todos')
                    setMostrarFavoritos(false)
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} encontrado{eventosFiltrados.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Resultados */}
          {eventosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground mb-6">
                {mostrarFavoritos 
                  ? 'Você ainda não tem eventos favoritos. Clique no ❤️ para adicionar eventos aos seus favoritos!'
                  : 'Tente ajustar os filtros ou usar termos de busca diferentes.'
                }
              </p>
              {(busca || filtroCategoria !== 'todos' || filtroTipo !== 'todos' || filtroPreco !== 'todos') && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setBusca('')
                    setFiltroCategoria('todos')
                    setFiltroTipo('todos')
                    setFiltroPreco('todos')
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {eventosFiltrados.map(evento => (
                <Card key={evento.id} className="event-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  <div className="relative">
                    {/* Imagem do Evento */}
                    <div className="w-full h-32 overflow-hidden">
                      <img 
                        src={getCategoriaImage(evento.categoria, evento.id)} 
                        alt={evento.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.src = getFallbackImage(800, 600)
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${getCategoriaGradient(evento.categoria)} opacity-20`}></div>
                    </div>
                    
                    {/* Badges sobrepostos na imagem */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Badge className="event-badge-category px-2 py-1 text-xs rounded-md backdrop-blur-sm bg-white/90 text-gray-800 shadow-lg flex items-center gap-1">
                        {getCategoriaIcon(evento.categoria)}
                        {evento.categoria}
                      </Badge>
                      <Badge 
                        className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 backdrop-blur-sm shadow-lg ${
                          evento.tipo === 'publico' 
                            ? 'bg-emerald-500/90 text-white' 
                            : 'bg-blue-600/90 text-white'
                        }`}
                      >
                        {evento.tipo === 'publico' ? (
                          <>
                            <Star className="w-2 h-2" />
                            PUB
                          </>
                        ) : (
                          <>
                            <Users className="w-2 h-2" />
                            PRIV
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Botão de Favorito */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm hover:bg-white rounded-md shadow-lg h-6 w-6"
                      onClick={() => toggleFavorito(evento.id)}
                    >
                      <Heart 
                        className={`w-3 h-3 ${
                          eventosFavoritos.has(evento.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`} 
                      />
                    </Button>
                  </div>

                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-base font-display line-clamp-2 mb-2">
                      {evento.titulo}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-3">
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                        <span>{formatarData(evento.data, evento.dataFim)}</span>
                      </div>
                      
                      {evento.horario && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                          <span>{evento.horario}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                        <span className="line-clamp-1">{evento.local}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-3 flex-shrink-0 event-icon" />
                        <span>{evento.informacoes?.publico_esperado || 'Não informado'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{evento.preco}</span>
                        <Badge variant="outline" className="text-xs">
                          {evento.organizador}
                        </Badge>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="text-xs px-4 py-2"
                        onClick={() => setEventoDestaque({...evento, statusAtual: getStatusEvento(evento)})}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
        </div>
        
        {/* Coluna direita - Notícias Gerais (1/4) */}
        <div className="lg:col-span-1">
          <div className="sidebar-sticky bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky" style={{top: '6rem', maxHeight: 'calc(100vh - 7rem)'}}>
          {/* Header da seção de notícias gerais */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white sticky top-0 z-5">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              <h4 className="text-lg font-bold">Notícias Gerais</h4>
            </div>
            <p className="text-sm opacity-90 mt-1">Todos os eventos da cidade</p>
          </div>
          
          {/* Lista de notícias gerais - ScrollArea para permitir scroll independente */}
          <div className="divide-y divide-gray-100 overflow-y-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
            {noticiasData.map((noticia, index) => {
              // Função para obter imagem da notícia geral
              const getImagemNoticiaGeral = (categoria, index) => {
                const imageBank = {
                  'Festival': [
                    '1493225457124-a3eb5c1c8d7d',
                    '1571068316344-7dd2c0ac8e62',
                    '1501386761578-f9fcd7c96c5b'
                  ],
                  'Lançamento': [
                    '1552664730-d307ca04f8a5',
                    '1560472354-b33ff0c44a5a'
                  ],
                  'Segurança': [
                    '1550745165-2d5a5170fa7f',
                    '1571019613454-1cb2f99b2d8b'
                  ],
                  'Tecnologia': [
                    '1518709268508-07ab52d3d73e',
                    '1531297484001-80c75c6e2e15'
                  ],
                  'Tradição': [
                    '1571068316344-7dd2c0ac8e62',
                    '1493225457124-a3eb5c1c8d7d'
                  ],
                  'Cultura': [
                    '1541961017571-139a7d7ddd6b',
                    '1518998053901-5348d3961a04'
                  ],
                  'Turismo': [
                    '1506905925327-d89e4b0c8bef',
                    '1545558014-8692077e9b5c'
                  ],
                  'Transporte': [
                    '1570825461953-4b4c4f4e4b4b',
                    '1540039740218-3edc5b044e20'
                  ],
                  'Gastronomia': [
                    '1555939594-f7405c036bc2',
                    '1504674900247-0877df9cc836'
                  ],
                  'Social': [
                    '1559757148-9e5e7c24f9eb',
                    '1576091160399-c745ef9394d1'
                  ],
                  'Economia': [
                    '1552664730-d307ca04f8a5',
                    '1560472354-b33ff0c44a5a'
                  ]
                }
                
                const images = imageBank[categoria] || imageBank['Festival']
                const imageId = images[index % images.length]
                return `https://images.unsplash.com/photo-${imageId}?w=120&h=80&fit=crop&crop=center&q=80`
              }
              
              const getCategoriaColorGeral = (categoria) => {
                switch (categoria.toLowerCase()) {
                  case 'festival':
                    return 'bg-purple-100 text-purple-700'
                  case 'lançamento':
                    return 'bg-blue-100 text-blue-700'
                  case 'segurança':
                    return 'bg-red-100 text-red-700'
                  case 'tecnologia':
                    return 'bg-green-100 text-green-700'
                  case 'tradição':
                    return 'bg-orange-100 text-orange-700'
                  case 'cultura':
                    return 'bg-indigo-100 text-indigo-700'
                  case 'turismo':
                    return 'bg-cyan-100 text-cyan-700'
                  case 'transporte':
                    return 'bg-yellow-100 text-yellow-700'
                  case 'gastronomia':
                    return 'bg-pink-100 text-pink-700'
                  case 'social':
                    return 'bg-emerald-100 text-emerald-700'
                  case 'economia':
                    return 'bg-slate-100 text-slate-700'
                  default:
                    return 'bg-gray-100 text-gray-700'
                }
              }
              
              return (
                <div key={`${noticia.id}-${index}`} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    {/* Pequena imagem */}
                    <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={getImagemNoticiaGeral(noticia.categoria, index)}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = getFallbackImage(120, 80)
                        }}
                      />
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      {/* Badge de categoria */}
                      <Badge 
                        variant="outline" 
                        size="sm" 
                        className={`${getCategoriaColorGeral(noticia.categoria)} text-xs mb-2 border-none`}
                      >
                        {noticia.categoria}
                      </Badge>
                      
                      {/* Título */}
                      <h5 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                        {noticia.titulo}
                      </h5>
                      
                      {/* Resumo */}
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                        {noticia.resumo}
                      </p>
                      
                      {/* Data e autor */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatarDataCurta(noticia.data)}</span>
                        </div>
                        <span className="truncate max-w-20">{noticia.autor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Footer com link para ver mais */}
          <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              Ver todas as notícias
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <div className="text-xs text-gray-500 mt-2">
              {noticiasData.length} notícias disponíveis
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer - Fora do grid para ocupar toda a largura */}
    <footer className="bg-secondary text-secondary-foreground py-12 w-full">
      <div className="container mx-auto px-1 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 font-display">Portal de Eventos Garanhuns</h3>
            <p className="text-sm opacity-90">
              Sua fonte completa de informações sobre todos os eventos da cidade de Garanhuns/PE.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-display">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Prefeitura de Garanhuns</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Secretaria de Cultura</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Guia do FIG</a></li>
            </ul>
          </div>
          <div id="contato">
            <h3 className="text-lg font-semibold mb-4 font-display">Contato</h3>
            <div className="space-y-2 text-sm">
              <p>📧 contato@eventosgaranhuns.com.br</p>
              <p>📱 (87) 9999-9999</p>
              <p>📍 Garanhuns, Pernambuco</p>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; 2025 Portal de Eventos Garanhuns. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
    </div>
  )
}

export default App