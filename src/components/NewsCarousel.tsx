import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Clock, Newspaper, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

/**
 * Representa uma notícia individual no sistema
 */
interface Noticia {
  id: string | number
  titulo: string
  resumo: string
  data: string
  destaque?: boolean
  categoria?: string
}

/**
 * Propriedades do componente NewsCarousel
 */
interface NewsCarouselProps {
  /** Array de notícias para exibir no carrossel */
  noticias?: Noticia[]
  /** Se deve reproduzir automaticamente o carrossel */
  autoPlay?: boolean
  /** Intervalo em milissegundos para mudança automática */
  interval?: number
}

/**
 * Carrossel de notícias com navegação automática e manual
 * 
 * @param props - Propriedades do componente
 * @returns Componente JSX do carrossel ou null se não há notícias
 */
export function NewsCarousel({ noticias = [], autoPlay = true, interval = 6000 }: NewsCarouselProps): JSX.Element | null {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const startTouchX = useRef<number>(0)
  const currentTouchX = useRef<number>(0)
  const isDragging = useRef<boolean>(false)

  // Usar TODAS as notícias vinculadas ao evento (não filtrar por destaque)
  const noticiasCarrossel = useMemo(() => noticias || [], [noticias])

  // Controle de loading
  useEffect(() => {
    // Simular um pequeno delay para verificar se os dados estão chegando
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Resetar loading quando receber notícias
  useEffect(() => {
    if (noticiasCarrossel.length > 0) {
      setIsLoading(false)
    }
  }, [noticiasCarrossel.length])

  /**
   * Obtém a URL da imagem baseada no título ou categoria da notícia
   * 
   * @param noticia - A notícia para obter a imagem
   * @returns URL da imagem apropriada
   */
  const obterImagemNoticia = useCallback((noticia: Noticia): string => {
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
  }, [])

  // Auto-play apenas se há mais de 1 notícia e usuário não está interagindo
  useEffect(() => {
    if (!autoPlay || noticiasCarrossel.length <= 1 || isUserInteracting) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex: number) => 
        prevIndex >= noticiasCarrossel.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, noticiasCarrossel.length, interval, isUserInteracting])

  // Resetar o índice se ele for maior que o número de notícias disponíveis
  useEffect(() => {
    if (currentIndex >= noticiasCarrossel.length && noticiasCarrossel.length > 0) {
      setCurrentIndex(0)
    }
  }, [currentIndex, noticiasCarrossel.length])

  /**
   * Formata a data em formato curto (DD/MM)
   * 
   * @param data - String da data a ser formatada
   * @returns Data formatada em DD/MM
   */
  const formatarDataCurta = useCallback((data: string): string => {
    const opcoes: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' }
    return new Date(data).toLocaleDateString('pt-BR', opcoes)
  }, [])

  /**
   * Navega para a notícia anterior
   */
  const goToPrevious = useCallback(() => {
    setCurrentIndex(currentIndex === 0 ? noticiasCarrossel.length - 1 : currentIndex - 1)
  }, [currentIndex, noticiasCarrossel.length])

  /**
   * Navega para a próxima notícia
   */
  const goToNext = useCallback(() => {
    setCurrentIndex(currentIndex >= noticiasCarrossel.length - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, noticiasCarrossel.length])

  /**
   * Navega diretamente para um índice específico
   */
  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsUserInteracting(true)
    setTimeout(() => setIsUserInteracting(false), 1000)
  }, [])

  /**
   * Handler para erro de carregamento de imagem
   */
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback para gradiente se a imagem não carregar
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
  }, [])

  // Handlers para touch/swipe em mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsUserInteracting(true)
    startTouchX.current = e.touches[0].clientX
    currentTouchX.current = e.touches[0].clientX
    isDragging.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startTouchX.current) return
    
    currentTouchX.current = e.touches[0].clientX
    const diffX = Math.abs(currentTouchX.current - startTouchX.current)
    
    if (diffX > 10) {
      isDragging.current = true
      // Previne scroll vertical durante o swipe horizontal
      e.preventDefault()
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!startTouchX.current || !isDragging.current) {
      setIsUserInteracting(false)
      return
    }

    const diffX = currentTouchX.current - startTouchX.current
    const threshold = 50 // Mínimo de pixels para considerar um swipe

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe para direita - voltar
        goToPrevious()
      } else {
        // Swipe para esquerda - avançar
        goToNext()
      }
    }

    // Reset dos valores
    startTouchX.current = 0
    currentTouchX.current = 0
    isDragging.current = false
    
    // Delay para reativar autoplay
    setTimeout(() => setIsUserInteracting(false), 1000)
  }, [goToPrevious, goToNext])

  // Handlers para mouse drag (desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsUserInteracting(true)
    startTouchX.current = e.clientX
    currentTouchX.current = e.clientX
    isDragging.current = false
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!startTouchX.current) return
      
      currentTouchX.current = e.clientX
      const diffX = Math.abs(currentTouchX.current - startTouchX.current)
      
      if (diffX > 10) {
        isDragging.current = true
      }
    }

    const handleMouseUp = () => {
      if (!startTouchX.current || !isDragging.current) {
        setIsUserInteracting(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        return
      }

      const diffX = currentTouchX.current - startTouchX.current
      const threshold = 50

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          goToPrevious()
        } else {
          goToNext()
        }
      }

      startTouchX.current = 0
      currentTouchX.current = 0
      isDragging.current = false
      setTimeout(() => setIsUserInteracting(false), 1000)
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [goToPrevious, goToNext])



  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="relative">
        <Card className="border-0 shadow-lg">
          <div className="min-h-[280px] sm:min-h-[320px] md:h-80 relative overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
            <div className="text-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Carregando notícias...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Se não há notícias após o loading, mostrar estado vazio
  if (noticiasCarrossel.length === 0) {
    return (
      <div className="relative">
        <Card className="border-0 shadow-lg">
          <div className="min-h-[280px] sm:min-h-[320px] md:h-80 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-600 p-6">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">Nenhuma notícia disponível</h3>
              <p className="text-gray-500">
                As notícias sobre este evento serão publicadas em breve.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">

      {/* Carrossel Principal */}
      <div 
        ref={carouselRef}
        className="overflow-hidden rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {noticiasCarrossel.map((noticia, index) => (
            <div key={noticia.id || index} className="w-full flex-shrink-0">
              <Card className="border-0 shadow-lg">
                <div className="relative">
                  {/* Imagem de fundo com altura adaptativa */}
                  <div className="min-h-[280px] sm:min-h-[320px] md:h-80 relative overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30">
                    <img 
                      src={obterImagemNoticia(noticia)}
                      alt={noticia.titulo}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    {/* Overlay sutil apenas para contraste do texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                  </div>

                  {/* Conteúdo sobreposto com melhor adaptação mobile */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-black/80 text-white border-white/70 backdrop-blur-sm shadow-lg text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatarDataCurta(noticia.data)}
                        </Badge>
                        {noticia.destaque && (
                          <Badge className="bg-red-600 text-white animate-pulse border-red-400 shadow-lg text-xs">
                            ✨ DESTAQUE
                        </Badge>
                        )}
                      </div>
                      
                      {/* Título responsivo com altura automática */}
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-display leading-tight text-white drop-shadow-2xl" 
                          style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                        {noticia.titulo}
                      </h3>
                      
                      {/* Resumo responsivo */}
                      <p className="text-sm sm:text-base md:text-lg text-gray-100 max-w-2xl drop-shadow-lg leading-relaxed" 
                         style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
                        {noticia.resumo}
                      </p>

                      <Button 
                        variant="secondary" 
                        className="w-fit bg-white/90 hover:bg-white text-gray-900 border-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm"
                        size="sm"
                      >
                        <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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

      {/* Controles de Navegação - Ocultos em mobile */}
      {noticiasCarrossel.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-white/30 z-10 hidden md:flex"
            onClick={goToPrevious}
            aria-label="Notícia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-white/30 z-10 hidden md:flex"
            onClick={goToNext}
            aria-label="Próxima notícia"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Indicadores */}
      {noticiasCarrossel.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4" role="tablist" aria-label="Indicadores do carrossel">
          {noticiasCarrossel.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => goToIndex(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Ir para notícia ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Indicador visual de swipe em mobile */}
      {noticiasCarrossel.length > 1 && (
        <div className="block md:hidden text-center mt-3 text-xs text-gray-500">
          <span>← Arraste para navegar →</span>
        </div>
      )}
    </div>
  )
}

export default NewsCarousel 