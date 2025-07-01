import React from 'react'
import { Newspaper, ArrowRight, Calendar, User, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'

const NewsSection = ({ noticias, onVerMaisNoticias }) => {
  // Pegar as 3 notícias mais recentes
  const noticiasRecentes = noticias
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 3)

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCategoriaColor = (categoria) => {
    switch (categoria.toLowerCase()) {
      case 'festival':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'lançamento':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'segurança':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'tecnologia':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'tradição':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header da Seção */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Newspaper className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-3xl font-bold">Últimas Notícias</h2>
              <p className="text-muted-foreground">Fique por dentro de tudo que acontece em Garanhuns</p>
            </div>
          </div>
          <Button onClick={onVerMaisNoticias} className="hidden md:flex">
            Ver todas as notícias
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {noticiasRecentes.map((noticia, index) => (
            <Card key={noticia.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${
              index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}>
              {noticia.imagem && (
                <div className={`overflow-hidden ${index === 0 ? 'h-48' : 'h-32'}`}>
                  <img 
                    src={noticia.imagem} 
                    alt={noticia.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <CardHeader className={index === 0 ? 'pb-3' : 'pb-2'}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" size="sm" className={getCategoriaColor(noticia.categoria)}>
                    {noticia.categoria}
                  </Badge>
                  {noticia.destaque && (
                    <Badge variant="default" size="sm">Destaque</Badge>
                  )}
                </div>
                <CardTitle className={`hover:text-primary transition-colors ${
                  index === 0 ? 'text-xl' : 'text-lg'
                } line-clamp-2`}>
                  {noticia.titulo}
                </CardTitle>
                {index === 0 && (
                  <CardDescription className="text-base">
                    {noticia.resumo}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                {index !== 0 && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {noticia.resumo}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatarData(noticia.data)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{noticia.autor}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botão Ver Mais (Mobile) */}
        <div className="text-center md:hidden">
          <Button onClick={onVerMaisNoticias} className="w-full">
            Ver todas as notícias
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{noticias.length}</div>
            <div className="text-sm text-muted-foreground">Notícias Publicadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {noticias.filter(n => n.categoria === 'Festival').length}
            </div>
            <div className="text-sm text-muted-foreground">Sobre Festivais</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {noticias.filter(n => n.destaque).length}
            </div>
            <div className="text-sm text-muted-foreground">Em Destaque</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(noticias.map(n => n.categoria)).size}
            </div>
            <div className="text-sm text-muted-foreground">Categorias</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsSection

