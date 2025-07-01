import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Bell, X, Clock, MapPin, Calendar } from 'lucide-react'

export const NotificationSystem = ({ eventos, eventosFavoritos }) => {
  const [notificacoes, setNotificacoes] = useState([])
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false)

  // Verificar eventos favoritos próximos
  useEffect(() => {
    const verificarEventosProximos = () => {
      const agora = new Date()
      const em24Horas = new Date(agora.getTime() + 24 * 60 * 60 * 1000)
      
      const eventosProximos = eventos.filter(evento => {
        if (!eventosFavoritos.has(evento.id)) return false
        
        const dataEvento = new Date(evento.data)
        return dataEvento > agora && dataEvento <= em24Horas
      })

      const novasNotificacoes = eventosProximos.map(evento => ({
        id: `evento_${evento.id}`,
        tipo: 'evento_proximo',
        titulo: 'Evento Favorito Amanhã!',
        mensagem: `${evento.titulo} acontece amanhã às ${evento.horario || 'horário a confirmar'}`,
        evento: evento,
        timestamp: new Date(),
        lida: false
      }))

      // Verificar se já existe notificação para estes eventos
      const notificacoesExistentes = JSON.parse(localStorage.getItem('notificacoes') || '[]')
      const idsExistentes = notificacoesExistentes.map(n => n.id)
      
      const notificacoesNovas = novasNotificacoes.filter(n => !idsExistentes.includes(n.id))
      
      if (notificacoesNovas.length > 0) {
        const todasNotificacoes = [...notificacoesExistentes, ...notificacoesNovas]
        localStorage.setItem('notificacoes', JSON.stringify(todasNotificacoes))
        setNotificacoes(todasNotificacoes)
      } else {
        setNotificacoes(notificacoesExistentes)
      }
    }

    verificarEventosProximos()
    
    // Verificar a cada hora
    const interval = setInterval(verificarEventosProximos, 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [eventos, eventosFavoritos])

  const marcarComoLida = (notificacaoId) => {
    const notificacoesAtualizadas = notificacoes.map(n => 
      n.id === notificacaoId ? { ...n, lida: true } : n
    )
    setNotificacoes(notificacoesAtualizadas)
    localStorage.setItem('notificacoes', JSON.stringify(notificacoesAtualizadas))
  }

  const removerNotificacao = (notificacaoId) => {
    const notificacoesAtualizadas = notificacoes.filter(n => n.id !== notificacaoId)
    setNotificacoes(notificacoesAtualizadas)
    localStorage.setItem('notificacoes', JSON.stringify(notificacoesAtualizadas))
  }

  const notificacaosPendentes = notificacoes.filter(n => !n.lida)

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {notificacaosPendentes.length > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {notificacaosPendentes.length}
          </Badge>
        )}
      </Button>

      {/* Painel de Notificações */}
      {mostrarNotificacoes && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notificações</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMostrarNotificacoes(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notificacoes.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
                <p className="text-sm">Adicione eventos aos favoritos para receber lembretes!</p>
              </div>
            ) : (
              notificacoes
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((notificacao) => (
                  <Card key={notificacao.id} className={`m-2 ${!notificacao.lida ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium">
                            {notificacao.titulo}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notificacao.mensagem}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerNotificacao(notificacao.id)}
                          className="p-1 h-auto"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {notificacao.evento && (
                      <CardContent className="pt-0">
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(notificacao.evento.data).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {notificacao.evento.horario && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{notificacao.evento.horario}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{notificacao.evento.local}</span>
                          </div>
                        </div>
                        
                        {!notificacao.lida && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => marcarComoLida(notificacao.id)}
                            className="mt-2 text-xs h-7"
                          >
                            Marcar como lida
                          </Button>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationSystem 