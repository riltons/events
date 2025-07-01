import React, { useState, useEffect } from 'react'
import { Clock, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

export function NewsCarousel({ noticias = [], autoPlay = true, interval = 6000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Usar TODAS as notícias vinculadas ao evento (não filtrar por destaque)
  const noticiasCarrossel = noticias || []

  // Função para obter imagem baseada na categoria ou título da notícia
  const obterImagemNoticia = (noticia) => {
    const titulo = noticia.titulo?.toLowerCase() || ''
    
    // Imagens específicas baseadas no conteúdo
    if (titulo.includes('forró') || titulo.includes('música') || titulo.includes('show')) {
      return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center'
    }
    if (titulo.includes('alceu') || titulo.includes('elba') || titulo.includes('artista')) {
      return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&crop=center'
    }
    if (titulo.includes('camarote') || titulo.includes('ingresso')) {
      return 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop&crop=center'
    }
    if (titulo.includes('transporte') || titulo.includes('ônibus')) {
      return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&crop=center'
    }
    if (titulo.includes('gastronomia') || titulo.includes('comida')) {
      return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&crop=center'
    }
    if (titulo.includes('quadrilha') || titulo.includes('concurso')) {
      return 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop&crop=center'
    }
    if (titulo.includes('criança') || titulo.includes('kids') || titulo.includes('infantil')) {
      return 'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=800&h=600&fit=crop&crop=center'
    }
    
    // Imagem padrão para eventos/festivais
    return 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop&crop=center'
  }

  // Auto-play apenas se há mais de 1 notícia
  useEffect(() => {
    if (!autoPlay || noticiasCarrossel.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= noticiasCarrossel.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, noticiasCarrossel.length, interval])

  // Resetar o índice se ele for maior que o número de notícias disponíveis
  useEffect(() => {
    if (currentIndex >= noticiasCarrossel.length && noticiasCarrossel.length > 0) {
      setCurrentIndex(0)
    }
  }, [currentIndex, noticiasCarrossel.length])

  const formatarDataCurta = (data) => {
    const opcoes = { day: '2-digit', month: '2-digit' }
    return new Date(data).toLocaleDateString('pt-BR', opcoes)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? noticiasCarrossel.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex >= noticiasCarrossel.length - 1 ? 0 : currentIndex + 1)
  }

  // Se não há notícias, não renderizar o carrossel
  if (noticiasCarrossel.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Carrossel Principal */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {noticiasCarrossel.map((noticia, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="border-0 shadow-lg">
                <div className="relative">
                  {/* Imagem de fundo */}
                  <div className="h-64 md:h-80 relative overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30">
                    <img 
                      src={obterImagemNoticia(noticia)}
                      alt={noticia.titulo}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para gradiente se a imagem não carregar
                        e.target.style.display = 'none'
                      }}
                    />
                    {/* Overlay sutil apenas para contraste do texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Conteúdo sobreposto */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-black/80 text-white border-white/70 backdrop-blur-sm shadow-lg">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatarDataCurta(noticia.data)}
                        </Badge>
                        {noticia.destaque && (
                          <Badge className="bg-red-600 text-white animate-pulse border-red-400 shadow-lg">
                            ✨ DESTAQUE
                        </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold font-display leading-tight text-white drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                        {noticia.titulo}
                      </h3>
                      
                      <p className="text-lg text-gray-100 max-w-2xl drop-shadow-lg" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                        {noticia.resumo}
                      </p>

                      <Button 
                        variant="secondary" 
                        className="w-fit bg-white/90 hover:bg-white text-gray-900 border-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Newspaper className="w-4 h-4 mr-2" />
                        Ler Notícia Completa
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de Navegação */}
      {noticiasCarrossel.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-white/30 z-10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-white/30 z-10"
            onClick={goToNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Indicadores */}
      {noticiasCarrossel.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {noticiasCarrossel.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NewsCarousel 