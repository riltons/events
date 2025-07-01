import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, Search, Filter, Star, Music, Utensils, Heart, Sparkles, Camera, Image, Ticket, Eye, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { MediaUpload, MediaGallery } from './components/MediaComponents.jsx'
import { AdManager } from './components/AdComponents.jsx'
import CalendarPage from './components/CalendarPage.jsx'
import NewsPage from './components/NewsPage.jsx'
import NewsSection from './components/NewsSection.jsx'
import EventHighlight from './components/EventHighlight.jsx'
import EventDetailPage from './components/EventDetailPage.jsx'
import { TicketCheckout, SuccessModal } from './components/TicketCheckout.jsx'
import InstagramIntegration from './components/InstagramIntegration.jsx'
import noticiasData from './data/noticiasData.js'
import './App.css'
import calendarioEventos from './assets/images/calendario_eventos_2025.jpg'

// Dados dos eventos baseados no calendário oficial de Garanhuns
const eventosData = [
  {
    id: 1,
    titulo: "Desfile das Virgens",
    data: "2025-02-28",
    local: "Centro de Garanhuns",
    categoria: "Religioso",
    tipo: "publico",
    descricao: "Tradicional desfile religioso que marca o início do calendário cultural da cidade.",
    imagem: calendarioEventos,
    destaque: true
  },
  {
    id: 2,
    titulo: "Jazz Festival e Carnaval dos Bairros",
    data: "2025-03-01",
    dataFim: "2025-03-04",
    local: "Diversos locais",
    categoria: "Musical",
    tipo: "publico",
    descricao: "Festival de jazz e carnaval que anima os bairros da cidade.",
    imagem: calendarioEventos,
    destaque: true
  },
  {
    id: 3,
    titulo: "Viva Garanhuns",
    data: "2025-05-01",
    dataFim: "2025-05-04",
    local: "Parque Euclides Dourado",
    categoria: "Forró",
    tipo: "publico",
    descricao: "O maior São João do Nordeste com grandes nomes do forró.",
    imagem: calendarioEventos,
    destaque: true
  },
  {
    id: 4,
    titulo: "Santo Antônio",
    data: "2025-06-01",
    dataFim: "2025-06-14",
    local: "Centro da cidade",
    categoria: "Religioso",
    tipo: "publico",
    descricao: "Festividades em homenagem a Santo Antônio com programação religiosa e cultural.",
    imagem: calendarioEventos,
    destaque: false
  },
  {
    id: 5,
    titulo: "Festival Gospel",
    data: "2025-07-04",
    dataFim: "2025-07-12",
    local: "Parque Euclides Dourado",
    categoria: "Gospel",
    tipo: "publico",
    descricao: "Festival de música gospel com grandes artistas nacionais.",
    imagem: calendarioEventos,
    destaque: false
  },
  {
    id: 6,
    titulo: "Festival de Inverno de Garanhuns (FIG)",
    data: "2025-07-10",
    dataFim: "2025-07-27",
    local: "Diversos locais",
    categoria: "Musical",
    tipo: "publico",
    descricao: "O tradicional Festival de Inverno com 35 anos de história e grandes shows.",
    imagem: calendarioEventos,
    destaque: true
  },
  {
    id: 7,
    titulo: "Viva Jesus",
    data: "2025-09-25",
    dataFim: "2025-09-28",
    local: "Centro da cidade",
    categoria: "Religioso",
    tipo: "publico",
    descricao: "Festival religioso com programação especial.",
    imagem: calendarioEventos,
    destaque: false
  },
  {
    id: 8,
    titulo: "Encantos do Natal",
    data: "2025-10-31",
    dataFim: "2026-01-11",
    local: "Centro de Garanhuns",
    categoria: "Natalino",
    tipo: "publico",
    descricao: "Decoração natalina e programação especial para as festividades de fim de ano.",
    imagem: calendarioEventos,
    destaque: true
  }
]

function App() {
  const [eventos, setEventos] = useState(eventosData)
  const [filtroCategoria, setFiltroCategoria] = useState('todos')
  const [busca, setBusca] = useState('')
  const [proximoEvento, setProximoEvento] = useState(null)
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'calendar', 'news', 'event-detail'
  const [noticias, setNoticias] = useState(noticiasData)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showTicketCheckout, setShowTicketCheckout] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchasedTickets, setPurchasedTickets] = useState([])
  const [ticketData, setTicketData] = useState({ ticketType: null, quantity: 1 })
  
  // Gerenciador de propagandas
  const { BannerAd, SidebarAds, InlineAd } = AdManager()

  useEffect(() => {
    // Encontrar o próximo evento
    const hoje = new Date()
    const eventosOrdenados = eventos
      .filter(evento => new Date(evento.data) >= hoje)
      .sort((a, b) => new Date(a.data) - new Date(b.data))
    
    if (eventosOrdenados.length > 0) {
      setProximoEvento(eventosOrdenados[0])
    }
  }, [eventos])

  const eventosFiltrados = eventos.filter(evento => {
    const matchCategoria = filtroCategoria === 'todos' || evento.categoria.toLowerCase() === filtroCategoria.toLowerCase()
    const matchBusca = evento.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                      evento.local.toLowerCase().includes(busca.toLowerCase())
    return matchCategoria && matchBusca
  })

  const categorias = ['todos', ...new Set(eventos.map(evento => evento.categoria))]

  const formatarData = (data, dataFim = null) => {
    const opcoes = { day: '2-digit', month: 'long', year: 'numeric' }
    const dataFormatada = new Date(data).toLocaleDateString('pt-BR', opcoes)
    
    if (dataFim) {
      const dataFimFormatada = new Date(dataFim).toLocaleDateString('pt-BR', opcoes)
      return `${dataFormatada} a ${dataFimFormatada}`
    }
    
    return dataFormatada
  }

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
      default:
        return <Star className="w-4 h-4" />
    }
  }

  // Renderização condicional baseada na página atual
  if (currentPage === 'news') {
    return (
      <div className="min-h-screen bg-background">
        {/* Banner de Propaganda */}
        {BannerAd}
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b" style={{ marginTop: BannerAd ? '60px' : '0' }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Portal de Eventos Garanhuns</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className={`transition-colors ${currentPage === 'home' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Eventos
                </button>
                <button 
                  onClick={() => setCurrentPage('calendar')}
                  className={`transition-colors ${currentPage === 'calendar' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Calendário
                </button>
                <button 
                  onClick={() => setCurrentPage('news')}
                  className={`transition-colors ${currentPage === 'news' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Notícias
                </button>
                <a href="#sobre" className="text-foreground hover:text-primary transition-colors">Sobre</a>
                <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
              </nav>
            </div>
          </div>
        </header>

        <NewsPage noticias={noticias} />

        {/* Footer */}
        <footer className="bg-secondary text-secondary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Portal de Eventos Garanhuns</h3>
                <p className="text-sm opacity-90">
                  Sua fonte completa de informações sobre todos os eventos da cidade de Garanhuns/PE.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-accent transition-colors">Prefeitura de Garanhuns</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Secretaria de Cultura</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Guia do FIG</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
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

  if (currentPage === 'calendar') {
    return (
      <div className="min-h-screen bg-background">
        {/* Banner de Propaganda */}
        {BannerAd}
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b" style={{ marginTop: BannerAd ? '60px' : '0' }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Portal de Eventos Garanhuns</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className={`transition-colors ${currentPage === 'home' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Eventos
                </button>
                <button 
                  onClick={() => setCurrentPage('calendar')}
                  className={`transition-colors ${currentPage === 'calendar' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Calendário
                </button>
                <button 
                  onClick={() => setCurrentPage('news')}
                  className={`transition-colors ${currentPage === 'news' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
                >
                  Notícias
                </button>
                <a href="#sobre" className="text-foreground hover:text-primary transition-colors">Sobre</a>
                <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
              </nav>
            </div>
          </div>
        </header>

        <CalendarPage eventos={eventos} />

        {/* Footer */}
        <footer className="bg-secondary text-secondary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Portal de Eventos Garanhuns</h3>
                <p className="text-sm opacity-90">
                  Sua fonte completa de informações sobre todos os eventos da cidade de Garanhuns/PE.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-accent transition-colors">Prefeitura de Garanhuns</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Secretaria de Cultura</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Guia do FIG</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Banner de Propaganda */}
      {BannerAd}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ marginTop: BannerAd ? '60px' : '0' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Portal de Eventos Garanhuns</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`transition-colors ${currentPage === 'home' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
              >
                Eventos
              </button>
              <button 
                onClick={() => setCurrentPage('calendar')}
                className={`transition-colors ${currentPage === 'calendar' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
              >
                Calendário
              </button>
              <button 
                onClick={() => setCurrentPage('news')}
                className={`transition-colors ${currentPage === 'news' ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
              >
                Notícias
              </button>
              <a href="#sobre" className="text-foreground hover:text-primary transition-colors">Sobre</a>
              <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Sua agenda cultural completa</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubra todos os eventos de Garanhuns em um só lugar. Do Festival de Inverno aos eventos locais, 
            não perca nada do que acontece na cidade.
          </p>
          {proximoEvento && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">Próximo Evento</h3>
              <p className="text-2xl font-bold">{proximoEvento.titulo}</p>
              <p className="text-sm opacity-90">{formatarData(proximoEvento.data, proximoEvento.dataFim)}</p>
            </div>
          )}
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria === 'todos' ? 'Todas as categorias' : categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos em Destaque */}
      <section id="eventos" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Eventos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosFiltrados
              .filter(evento => evento.destaque)
              .map(evento => (
                <Card key={evento.id} className="event-card">
                  <div className="relative">
                    <img 
                      src={evento.imagem} 
                      alt={evento.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className={evento.tipo === 'publico' ? 'festival-badge' : 'private-badge'} 
                           style={{position: 'absolute', top: '12px', right: '12px'}}>
                      {evento.tipo === 'publico' ? 'Oficial' : 'Privado'}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{evento.titulo}</CardTitle>
                      <div className="flex items-center text-primary">
                        {getCategoriaIcon(evento.categoria)}
                      </div>
                    </div>
                    <CardDescription>{evento.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatarData(evento.data, evento.dataFim)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {evento.local}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Ver Detalhes</Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Image className="w-5 h-5" />
                              {evento.titulo} - Galeria
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <MediaUpload 
                              eventId={evento.id} 
                              onUploadSuccess={() => {
                                // Recarregar galeria
                              }}
                            />
                            <MediaGallery eventId={evento.id} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Propaganda Inline */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {InlineAd}
        </div>
      </section>

      {/* Seção de Notícias */}
      <NewsSection 
        noticias={noticias} 
        onVerMaisNoticias={() => setCurrentPage('news')} 
      />

      {/* Todos os Eventos */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Todos os Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1">
              {/* Sidebar com propagandas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Patrocinadores</h3>
                {SidebarAds}
              </div>
            </div>
            <div className="lg:col-span-2 xl:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map(evento => (
              <Card key={evento.id} className="event-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {evento.categoria}
                    </Badge>
                    <div className="flex items-center text-primary">
                      {getCategoriaIcon(evento.categoria)}
                    </div>
                  </div>
                  <CardTitle className="text-base">{evento.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatarData(evento.data, evento.dataFim)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {evento.local}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">Saiba Mais</Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Camera className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Image className="w-5 h-5" />
                            {evento.titulo} - Galeria
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <MediaUpload 
                            eventId={evento.id} 
                            onUploadSuccess={() => {
                              // Recarregar galeria
                            }}
                          />
                          <MediaGallery eventId={evento.id} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Portal de Eventos Garanhuns</h3>
              <p className="text-sm opacity-90">
                Sua fonte completa de informações sobre todos os eventos da cidade de Garanhuns/PE.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Prefeitura de Garanhuns</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Secretaria de Cultura</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Guia do FIG</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
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

