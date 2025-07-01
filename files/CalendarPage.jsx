import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Star, Music, Heart, Utensils, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import calendarioEventos from '../assets/images/calendario_eventos_2025.jpg'

const CalendarPage = ({ eventos }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [viewMode, setViewMode] = useState('month') // 'month', 'year'

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getCategoriaIcon = (categoria) => {
    switch (categoria.toLowerCase()) {
      case 'musical':
      case 'forró':
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

  const getCategoriaColor = (categoria) => {
    switch (categoria.toLowerCase()) {
      case 'musical':
      case 'forró':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'religioso':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'gastronômico':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'natalino':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const formatarData = (data, dataFim = null) => {
    const opcoes = { day: '2-digit', month: 'long', year: 'numeric' }
    const dataFormatada = new Date(data).toLocaleDateString('pt-BR', opcoes)
    
    if (dataFim) {
      const dataFimFormatada = new Date(dataFim).toLocaleDateString('pt-BR', opcoes)
      return `${dataFormatada} a ${dataFimFormatada}`
    }
    
    return dataFormatada
  }

  const getEventosDoMes = (ano, mes) => {
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.data)
      const dataFimEvento = evento.dataFim ? new Date(evento.dataFim) : dataEvento
      
      return (dataEvento.getFullYear() === ano && dataEvento.getMonth() === mes) ||
             (dataFimEvento.getFullYear() === ano && dataFimEvento.getMonth() === mes) ||
             (dataEvento <= new Date(ano, mes, 1) && dataFimEvento >= new Date(ano, mes + 1, 0))
    })
  }

  const getEventosDoDia = (data) => {
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.data)
      const dataFimEvento = evento.dataFim ? new Date(evento.dataFim) : dataEvento
      
      return data >= dataEvento && data <= dataFimEvento
    })
  }

  const getDiasDoMes = (ano, mes) => {
    const primeiroDia = new Date(ano, mes, 1)
    const ultimoDia = new Date(ano, mes + 1, 0)
    const diasAntes = primeiroDia.getDay()
    const diasNoMes = ultimoDia.getDate()
    
    const dias = []
    
    // Dias do mês anterior
    for (let i = diasAntes - 1; i >= 0; i--) {
      const dia = new Date(ano, mes, -i)
      dias.push({ data: dia, outroMes: true })
    }
    
    // Dias do mês atual
    for (let i = 1; i <= diasNoMes; i++) {
      const dia = new Date(ano, mes, i)
      dias.push({ data: dia, outroMes: false })
    }
    
    // Dias do próximo mês para completar a grade
    const diasRestantes = 42 - dias.length
    for (let i = 1; i <= diasRestantes; i++) {
      const dia = new Date(ano, mes + 1, i)
      dias.push({ data: dia, outroMes: true })
    }
    
    return dias
  }

  const navegarMes = (direcao) => {
    const novaData = new Date(currentDate)
    novaData.setMonth(currentDate.getMonth() + direcao)
    setCurrentDate(novaData)
  }

  const navegarAno = (direcao) => {
    const novaData = new Date(currentDate)
    novaData.setFullYear(currentDate.getFullYear() + direcao)
    setCurrentDate(novaData)
  }

  const eventosDoMes = getEventosDoMes(currentDate.getFullYear(), currentDate.getMonth())
  const diasDoMes = getDiasDoMes(currentDate.getFullYear(), currentDate.getMonth())

  if (viewMode === 'year') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header da Página */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Calendário de Eventos {currentDate.getFullYear()}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => navegarAno(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => setViewMode('month')}>
                  Ver Mês
                </Button>
                <Button variant="outline" onClick={() => navegarAno(1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendário Anual */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meses.map((mes, index) => {
              const eventosDoMesAtual = getEventosDoMes(currentDate.getFullYear(), index)
              return (
                <Card key={mes} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setCurrentDate(new Date(currentDate.getFullYear(), index, 1))
                        setViewMode('month')
                      }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{mes}</CardTitle>
                    <CardDescription>
                      {eventosDoMesAtual.length} evento{eventosDoMesAtual.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {eventosDoMesAtual.slice(0, 3).map(evento => (
                        <div key={evento.id} className="flex items-center space-x-2 text-sm">
                          {getCategoriaIcon(evento.categoria)}
                          <span className="truncate">{evento.titulo}</span>
                        </div>
                      ))}
                      {eventosDoMesAtual.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{eventosDoMesAtual.length - 3} mais
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header da Página */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Calendário de Eventos</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navegarMes(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setViewMode('year')}>
                {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Button>
              <Button variant="outline" onClick={() => navegarMes(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {diasSemana.map(dia => (
                    <div key={dia} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {dia}
                    </div>
                  ))}
                </div>

                {/* Grade do calendário */}
                <div className="grid grid-cols-7 gap-1">
                  {diasDoMes.map((diaObj, index) => {
                    const { data, outroMes } = diaObj
                    const eventosNoDia = getEventosDoDia(data)
                    const isSelected = selectedDate && 
                      data.toDateString() === selectedDate.toDateString()
                    const isToday = data.toDateString() === new Date().toDateString()

                    return (
                      <div
                        key={index}
                        className={`
                          p-2 min-h-[80px] border border-border cursor-pointer transition-colors
                          ${outroMes ? 'text-muted-foreground bg-muted/30' : 'hover:bg-muted/50'}
                          ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                          ${isToday ? 'ring-2 ring-primary' : ''}
                        `}
                        onClick={() => setSelectedDate(data)}
                      >
                        <div className="text-sm font-medium mb-1">
                          {data.getDate()}
                        </div>
                        <div className="space-y-1">
                          {eventosNoDia.slice(0, 2).map(evento => (
                            <div
                              key={evento.id}
                              className={`
                                text-xs p-1 rounded truncate
                                ${getCategoriaColor(evento.categoria)}
                              `}
                            >
                              {evento.titulo}
                            </div>
                          ))}
                          {eventosNoDia.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{eventosNoDia.length - 2}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com eventos */}
          <div className="space-y-6">
            {/* Eventos do dia selecionado */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Eventos em {selectedDate.toLocaleDateString('pt-BR')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getEventosDoDia(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      {getEventosDoDia(selectedDate).map(evento => (
                        <div key={evento.id} className="border-l-4 border-primary pl-3">
                          <div className="flex items-center space-x-2 mb-1">
                            {getCategoriaIcon(evento.categoria)}
                            <h4 className="font-medium">{evento.titulo}</h4>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatarData(evento.data, evento.dataFim)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{evento.local}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-2">
                            {evento.categoria}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum evento neste dia.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Eventos do mês */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Eventos em {meses[currentDate.getMonth()]}
                </CardTitle>
                <CardDescription>
                  {eventosDoMes.length} evento{eventosDoMes.length !== 1 ? 's' : ''} este mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventosDoMes.map(evento => (
                    <div key={evento.id} className="border-l-4 border-primary pl-3">
                      <div className="flex items-center space-x-2 mb-1">
                        {getCategoriaIcon(evento.categoria)}
                        <h4 className="font-medium text-sm">{evento.titulo}</h4>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatarData(evento.data, evento.dataFim)}
                      </div>
                      <Badge variant="outline" size="sm" className="mt-1">
                        {evento.categoria}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Calendário Oficial */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendário Oficial 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={calendarioEventos} 
                  alt="Calendário Oficial de Eventos 2025"
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage

