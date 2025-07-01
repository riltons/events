import React, { useState } from 'react'
import { Newspaper, Calendar, User, ArrowRight, Search, Filter, Clock, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

const NewsPage = ({ noticias }) => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [busca, setBusca] = useState('')
  const [noticiaExpandida, setNoticiaExpandida] = useState(null)

  const categorias = ['todas', ...new Set(noticias.map(noticia => noticia.categoria))]

  const noticiasFiltradas = noticias.filter(noticia => {
    const matchCategoria = filtroCategoria === 'todas' || noticia.categoria === filtroCategoria
    const matchBusca = noticia.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                      noticia.resumo.toLowerCase().includes(busca.toLowerCase())
    return matchCategoria && matchBusca
  })

  const noticiasDestaque = noticiasFiltradas.filter(noticia => noticia.destaque)
  const outrasNoticias = noticiasFiltradas.filter(noticia => !noticia.destaque)

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
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

  if (noticiaExpandida) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header da Notícia */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Newspaper className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Notícias</h1>
              </div>
              <Button variant="outline" onClick={() => setNoticiaExpandida(null)}>
                Voltar às Notícias
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo da Notícia */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <article className="bg-white rounded-lg shadow-sm border p-8">
              {/* Cabeçalho da Notícia */}
              <header className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="outline" className={getCategoriaColor(noticiaExpandida.categoria)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {noticiaExpandida.categoria}
                  </Badge>
                  {noticiaExpandida.destaque && (
                    <Badge variant="default">Destaque</Badge>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {noticiaExpandida.titulo}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6">
                  {noticiaExpandida.resumo}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatarData(noticiaExpandida.data)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{noticiaExpandida.autor}</span>
                  </div>
                </div>
              </header>

              {/* Imagem da Notícia */}
              {noticiaExpandida.imagem && (
                <div className="mb-8">
                  <img 
                    src={noticiaExpandida.imagem} 
                    alt={noticiaExpandida.titulo}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}

              {/* Conteúdo da Notícia */}
              <div className="prose prose-lg max-w-none">
                {noticiaExpandida.conteudo.split('\n\n').map((paragrafo, index) => (
                  <p key={index} className="mb-4 text-foreground leading-relaxed">
                    {paragrafo}
                  </p>
                ))}
              </div>

              {/* Rodapé da Notícia */}
              <footer className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Publicado em {formatarData(noticiaExpandida.data)} por {noticiaExpandida.autor}
                  </div>
                  <Button variant="outline" onClick={() => setNoticiaExpandida(null)}>
                    Voltar às Notícias
                  </Button>
                </div>
              </footer>
            </article>
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
              <Newspaper className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Notícias</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {noticiasFiltradas.length} notícia{noticiasFiltradas.length !== 1 ? 's' : ''} encontrada{noticiasFiltradas.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar notícias..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas as categorias' : categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notícias em Destaque */}
        {noticiasDestaque.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Notícias em Destaque</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {noticiasDestaque.map(noticia => (
                <Card key={noticia.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setNoticiaExpandida(noticia)}>
                  {noticia.imagem && (
                    <div className="h-48 overflow-hidden">
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
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getCategoriaColor(noticia.categoria)}>
                        {noticia.categoria}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatarData(noticia.data)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      {noticia.titulo}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {noticia.resumo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{noticia.autor}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ler mais <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Outras Notícias */}
        {outrasNoticias.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Todas as Notícias</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outrasNoticias.map(noticia => (
                <Card key={noticia.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setNoticiaExpandida(noticia)}>
                  {noticia.imagem && (
                    <div className="h-32 overflow-hidden">
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
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" size="sm" className={getCategoriaColor(noticia.categoria)}>
                        {noticia.categoria}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatarData(noticia.data)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                      {noticia.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {noticia.resumo}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{noticia.autor}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Mensagem quando não há notícias */}
        {noticiasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsPage

