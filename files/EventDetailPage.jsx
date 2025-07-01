import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, Star, Ticket, Navigation, Phone, Globe, Instagram, Facebook, Share2, Heart, Eye, Timer, ArrowLeft, Camera, MessageCircle, ThumbsUp, MapIcon, Wifi, Parking, Accessibility, CreditCard, QrCode } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { MediaGallery, MediaUpload } from './MediaComponents.jsx'

const EventDetailPage = ({ evento, onBack, onBuyTicket }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [ticketType, setTicketType] = useState('individual')
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [tempoRestante, setTempoRestante] = useState(null)
  const [statusEvento, setStatusEvento] = useState('upcoming')

  useEffect(() => {
    const calcularStatus = () => {
      const agora = new Date()
      const inicio = new Date(evento.dataInicio)
      const fim = new Date(evento.dataFim)

      if (agora >= inicio && agora <= fim) {
        setStatusEvento('happening')
      } else if (agora < inicio) {
        setStatusEvento('upcoming')
      } else {
        setStatusEvento('ended')
      }
    }

    calcularStatus()
    const interval = setInterval(calcularStatus, 60000) // Atualiza a cada minuto

    return () => clearInterval(interval)
  }, [evento])

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
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
        return 'EM BREVE'
      case 'ended':
        return 'ENCERRADO'
      default:
        return 'EM BREVE'
    }
  }

  const calcularPrecoTotal = () => {
    const precoBase = evento.preco === 'Gratuito' ? 0 : parseFloat(evento.preco) || 0
    const multiplicador = ticketType === 'mesa' ? 4 : 1 // Mesa para 4 pessoas
    return precoBase * ticketQuantity * multiplicador
  }

  const handleComprarIngresso = () => {
    const dadosCompra = {
      evento: evento.id,
      quantidade: ticketQuantity,
      tipo: ticketType,
      total: calcularPrecoTotal()
    }
    
    if (onBuyTicket) {
      onBuyTicket(dadosCompra)
    }
    setShowTicketModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com imagem de fundo */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-4"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Eventos
            </Button>

            <div className="flex items-center space-x-3 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {getCategoriaIcon(evento.categoria)}
                <span className="ml-1">{evento.categoria}</span>
              </Badge>
              <div className={`px-3 py-1 rounded-full ${getStatusColor()} text-white text-sm font-semibold`}>
                {getStatusText()}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{evento.titulo}</h1>
            <p className="text-xl opacity-90 max-w-2xl">{evento.descricao}</p>
          </div>
        </div>
      </div>

      {/* Navegação de abas */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="location">Localização</TabsTrigger>
              <TabsTrigger value="media">Galeria</TabsTrigger>
              <TabsTrigger value="tickets">Ingressos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Informações principais */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Evento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-semibold">{formatarData(evento.dataInicio)}</div>
                          <div className="text-sm text-gray-600">
                            {formatarHora(evento.dataInicio)}
                            {evento.horaFim && ` - ${formatarHora(evento.dataFim)}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-semibold">{evento.local}</div>
                          <div className="text-sm text-gray-600">Garanhuns, PE</div>
                        </div>
                      </div>

                      {evento.capacidade && (
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-semibold">Capacidade: {evento.capacidade}</div>
                            <div className="text-sm text-gray-600">pessoas</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <Ticket className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-semibold">
                            {evento.preco === 'Gratuito' ? 'Entrada Gratuita' : `A partir de R$ ${evento.preco}`}
                          </div>
                          <div className="text-sm text-gray-600">por pessoa</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Descrição detalhada */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre o Evento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {evento.descricaoCompleta || evento.descricao}
                    </p>
                    
                    {evento.programacao && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Programação:</h4>
                        <ul className="space-y-2">
                          {evento.programacao.map((item, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{item.hora}</span>
                              <span>{item.atividade}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ações rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {evento.preco && evento.preco !== 'Gratuito' && (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => setShowTicketModal(true)}
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        Comprar Ingressos
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full">
                      <Navigation className="w-4 h-4 mr-2" />
                      Como Chegar
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowMediaModal(true)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Adicionar Foto
                    </Button>
                  </CardContent>
                </Card>

                {/* Facilidades */}
                <Card>
                  <CardHeader>
                    <CardTitle>Facilidades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Wifi className="w-4 h-4 text-blue-600" />
                        <span>Wi-Fi</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Parking className="w-4 h-4 text-green-600" />
                        <span>Estacionamento</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Accessibility className="w-4 h-4 text-purple-600" />
                        <span>Acessível</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CreditCard className="w-4 h-4 text-orange-600" />
                        <span>Cartão</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contato */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {evento.telefone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{evento.telefone}</span>
                      </div>
                    )}
                    
                    {evento.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{evento.website}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Instagram className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Facebook className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Outras abas seriam implementadas aqui */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes Completos</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Informações detalhadas sobre o evento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Localização e Como Chegar</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Mapa e instruções de localização...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <MediaGallery eventId={evento.id} />
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Ingressos e Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema de venda de ingressos...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Compra de Ingressos */}
      <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comprar Ingressos</DialogTitle>
            <DialogDescription>
              {evento.titulo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ticket-type">Tipo de Ingresso</Label>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="mesa">Mesa (4 pessoas)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  R$ {calcularPrecoTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowTicketModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleComprarIngresso}>
                <QrCode className="w-4 h-4 mr-2" />
                Comprar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Upload de Mídia */}
      <Dialog open={showMediaModal} onOpenChange={setShowMediaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Foto ou Vídeo</DialogTitle>
            <DialogDescription>
              Compartilhe suas memórias do evento
            </DialogDescription>
          </DialogHeader>
          <MediaUpload 
            eventId={evento.id} 
            onClose={() => setShowMediaModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventDetailPage

