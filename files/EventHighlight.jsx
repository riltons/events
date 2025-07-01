import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, Star, Ticket, Navigation, Phone, Globe, Instagram, Facebook, Share2, Heart, Eye, Timer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Separator } from '@/components/ui/separator.jsx'

const EventHighlight = ({ eventos }) => {
  const [eventoAtual, setEventoAtual] = useState(null)
  const [tempoRestante, setTempoRestante] = useState(null)
  const [statusEvento, setStatusEvento] = useState('upcoming') // 'happening', 'upcoming', 'ended'

  useEffect(() => {
    const hoje = new Date()
    
    // Encontrar evento que está acontecendo agora
    const eventoHappening = eventos.find(evento => {
      const inicio = new Date(evento.dataInicio)
      const fim = new Date(evento.dataFim)
      return hoje >= inicio && hoje <= fim
    })

    if (eventoHappening) {
      setEventoAtual(eventoHappening)
      setStatusEvento('happening')
      return
    }

    // Se não há evento acontecendo, encontrar o próximo
    const eventosProximos = eventos
      .filter(evento => new Date(evento.dataInicio) > hoje)
      .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))

    if (eventosProximos.length > 0) {
      setEventoAtual(eventosProximos[0])
      setStatusEvento('upcoming')
    }
  }, [eventos])

  useEffect(() => {
    if (!eventoAtual) return

    const calcularTempoRestante = () => {
      const agora = new Date()
      const dataEvento = statusEvento === 'happening' 
        ? new Date(eventoAtual.dataFim) 
        : new Date(eventoAtual.dataInicio)
      
      const diferenca = dataEvento - agora

      if (diferenca <= 0) {
        if (statusEvento === 'happening') {
          setStatusEvento('ended')
        }
        setTempoRestante(null)
        return
      }

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60))
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000)

      setTempoRestante({ dias, horas, minutos, segundos })
    }

    calcularTempoRestante()
    const interval = setInterval(calcularTempoRestante, 1000)

    return () => clearInterval(interval)
  }, [eventoAtual, statusEvento])

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatarHora = (data) => {
    return new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = () => {
    switch (statusEvento) {
      case 'happening':
        return 'bg-green-500'
      case 'upcoming':
        return 'bg-blue-500'
      case 'ended':
        return 'bg-gray-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getStatusText = () => {
    switch (statusEvento) {
      case 'happening':
        return 'ACONTECENDO AGORA'
      case 'upcoming':
        return 'PRÓXIMO EVENTO'
      case 'ended':
        return 'EVENTO ENCERRADO'
      default:
        return 'PRÓXIMO EVENTO'
    }
  }

  const getCategoriaIcon = (categoria) => {
    switch (categoria.toLowerCase()) {
      case 'musical':
        return <Star className="w-4 h-4" />
      case 'religioso':
        return <Heart className="w-4 h-4" />
      case 'gastronômico':
        return <Users className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  if (!eventoAtual) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Nenhum evento próximo</h2>
          <p className="text-xl opacity-90">Fique atento às próximas atualizações!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Status Badge */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${getStatusColor()} text-white font-bold text-lg shadow-lg`}>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span>{getStatusText()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Informações do Evento */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {getCategoriaIcon(eventoAtual.categoria)}
                <span className="ml-1">{eventoAtual.categoria}</span>
              </Badge>
              {eventoAtual.destaque && (
                <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
                  <Star className="w-3 h-3 mr-1" />
                  Destaque
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {eventoAtual.titulo}
            </h1>

            <p className="text-xl opacity-90 mb-6 leading-relaxed">
              {eventoAtual.descricao}
            </p>

            {/* Detalhes do Evento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <div>
                  <div className="font-semibold">
                    {formatarData(eventoAtual.dataInicio)}
                    {eventoAtual.dataFim && eventoAtual.dataInicio !== eventoAtual.dataFim && 
                      ` - ${formatarData(eventoAtual.dataFim)}`
                    }
                  </div>
                  <div className="text-sm opacity-75">
                    {formatarHora(eventoAtual.dataInicio)}
                    {eventoAtual.horaFim && ` - ${formatarHora(eventoAtual.dataFim)}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <div>
                  <div className="font-semibold">{eventoAtual.local}</div>
                  <div className="text-sm opacity-75">Garanhuns, PE</div>
                </div>
              </div>

              {eventoAtual.capacidade && (
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Capacidade: {eventoAtual.capacidade}</div>
                    <div className="text-sm opacity-75">pessoas</div>
                  </div>
                </div>
              )}

              {eventoAtual.preco && (
                <div className="flex items-center space-x-3">
                  <Ticket className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">
                      {eventoAtual.preco === 'Gratuito' ? 'Gratuito' : `R$ ${eventoAtual.preco}`}
                    </div>
                    <div className="text-sm opacity-75">entrada</div>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3">
              {eventoAtual.preco && eventoAtual.preco !== 'Gratuito' && (
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Ticket className="w-5 h-5 mr-2" />
                  Comprar Ingressos
                </Button>
              )}
              
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Navigation className="w-5 h-5 mr-2" />
                Como Chegar
              </Button>

              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="lg:col-span-1">
            {tempoRestante && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Timer className="w-5 h-5" />
                    <span>
                      {statusEvento === 'happening' ? 'Termina em:' : 'Começa em:'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{tempoRestante.dias}</div>
                      <div className="text-sm opacity-75">Dias</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{tempoRestante.horas}</div>
                      <div className="text-sm opacity-75">Horas</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{tempoRestante.minutos}</div>
                      <div className="text-sm opacity-75">Min</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{tempoRestante.segundos}</div>
                      <div className="text-sm opacity-75">Seg</div>
                    </div>
                  </div>

                  {statusEvento === 'happening' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progresso do evento</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="bg-white/20" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Informações Adicionais */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Informações Úteis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {eventoAtual.telefone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{eventoAtual.telefone}</span>
                  </div>
                )}
                
                {eventoAtual.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{eventoAtual.website}</span>
                  </div>
                )}

                <Separator className="bg-white/20" />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Compartilhar:</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Facebook className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventHighlight

