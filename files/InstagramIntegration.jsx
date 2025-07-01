import React, { useState, useEffect } from 'react'
import { Instagram, Share2, Camera, Image, Video, Calendar, MapPin, Users, ExternalLink, Copy, CheckCircle, AlertCircle, Loader2, Hash, AtSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

const InstagramIntegration = ({ evento }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [instagramAccount, setInstagramAccount] = useState(null)
  const [postContent, setPostContent] = useState('')
  const [selectedMedia, setSelectedMedia] = useState([])
  const [hashtags, setHashtags] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [autoPost, setAutoPost] = useState(false)
  const [postTemplate, setPostTemplate] = useState('evento')

  // Templates de posts predefinidos
  const templates = {
    evento: {
      title: 'Divulgação do Evento',
      content: `🎉 ${evento.titulo} 🎉

📅 ${new Date(evento.dataInicio).toLocaleDateString('pt-BR')}
📍 ${evento.local}, Garanhuns/PE
🎫 ${evento.preco === 'Gratuito' ? 'Entrada Gratuita' : `A partir de R$ ${evento.preco}`}

${evento.descricao}

Não perca! Garanhuns te espera! 🌟

#EventosGaranhuns #${evento.categoria} #Garanhuns #Pernambuco #Cultura #Diversão`
    },
    countdown: {
      title: 'Contagem Regressiva',
      content: `⏰ FALTAM POUCOS DIAS! ⏰

${evento.titulo} está chegando!

📅 ${new Date(evento.dataInicio).toLocaleDateString('pt-BR')}
📍 ${evento.local}

Você já garantiu seu lugar? 🎫

#EventosGaranhuns #${evento.categoria} #ContagemRegressiva #Garanhuns`
    },
    lembrete: {
      title: 'Lembrete do Evento',
      content: `🔔 LEMBRETE IMPORTANTE! 🔔

${evento.titulo} é HOJE!

⏰ ${new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
📍 ${evento.local}, Garanhuns/PE

Nos vemos lá! 🎉

#EventosGaranhuns #${evento.categoria} #Hoje #Garanhuns`
    },
    agradecimento: {
      title: 'Agradecimento Pós-Evento',
      content: `🙏 OBRIGADO A TODOS! 🙏

${evento.titulo} foi um sucesso absoluto!

Agradecemos a presença de todos que fizeram parte deste momento especial em Garanhuns! 💖

Já estamos preparando o próximo... Fiquem ligados! 👀

#EventosGaranhuns #${evento.categoria} #Obrigado #Garanhuns #Sucesso`
    }
  }

  useEffect(() => {
    // Verificar se há token salvo
    const savedToken = localStorage.getItem('instagram_access_token')
    if (savedToken) {
      setAccessToken(savedToken)
      setIsConnected(true)
      fetchInstagramAccount(savedToken)
    }
  }, [])

  useEffect(() => {
    // Atualizar conteúdo quando template mudar
    if (templates[postTemplate]) {
      setPostContent(templates[postTemplate].content)
      setHashtags(extractHashtags(templates[postTemplate].content))
    }
  }, [postTemplate, evento])

  const extractHashtags = (content) => {
    const hashtagRegex = /#\w+/g
    const matches = content.match(hashtagRegex)
    return matches ? matches.join(' ') : ''
  }

  const connectInstagram = () => {
    // Simular conexão com Instagram (em produção, usaria OAuth)
    const mockToken = 'mock_instagram_token_' + Date.now()
    setAccessToken(mockToken)
    setIsConnected(true)
    localStorage.setItem('instagram_access_token', mockToken)
    
    // Simular dados da conta
    setInstagramAccount({
      id: '123456789',
      username: 'eventosgaranhuns',
      name: 'Portal de Eventos Garanhuns',
      followers_count: 15420,
      media_count: 342
    })
  }

  const disconnectInstagram = () => {
    setAccessToken('')
    setIsConnected(false)
    setInstagramAccount(null)
    localStorage.removeItem('instagram_access_token')
  }

  const fetchInstagramAccount = async (token) => {
    // Simular busca de dados da conta
    setInstagramAccount({
      id: '123456789',
      username: 'eventosgaranhuns',
      name: 'Portal de Eventos Garanhuns',
      followers_count: 15420,
      media_count: 342
    })
  }

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files)
    const mediaFiles = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }))
    setSelectedMedia([...selectedMedia, ...mediaFiles])
  }

  const removeMedia = (index) => {
    const newMedia = selectedMedia.filter((_, i) => i !== index)
    setSelectedMedia(newMedia)
  }

  const postToInstagram = async () => {
    setIsPosting(true)
    
    try {
      // Simular post no Instagram
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Em produção, faria a chamada real para a API do Instagram
      const postData = {
        caption: postContent,
        media: selectedMedia,
        access_token: accessToken
      }
      
      console.log('Posting to Instagram:', postData)
      
      setPostSuccess(true)
      setPostContent('')
      setSelectedMedia([])
      
      // Salvar post no backend
      await saveInstagramPost({
        event_id: evento.id,
        content: postContent,
        media_count: selectedMedia.length,
        posted_at: new Date().toISOString()
      })
      
    } catch (error) {
      console.error('Erro ao postar no Instagram:', error)
    }
    
    setIsPosting(false)
  }

  const saveInstagramPost = async (postData) => {
    try {
      const response = await fetch('https://e5h6i7c0x97j.manus.space/api/instagram/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })
      
      if (!response.ok) {
        throw new Error('Erro ao salvar post')
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error)
    }
  }

  const generateShareableContent = () => {
    const eventUrl = `${window.location.origin}/evento/${evento.id}`
    const shareText = `🎉 ${evento.titulo}
📅 ${new Date(evento.dataInicio).toLocaleDateString('pt-BR')}
📍 ${evento.local}, Garanhuns/PE

Saiba mais: ${eventUrl}

#EventosGaranhuns #${evento.categoria}`

    return shareText
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Instagram className="w-5 h-5" />
            <span>Integração com Instagram</span>
          </CardTitle>
          <CardDescription>
            Conecte sua conta do Instagram para divulgar eventos automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Conectar Instagram</h3>
                <p className="text-sm text-gray-600">
                  Autorize o acesso para começar a divulgar seus eventos
                </p>
              </div>
              <Button onClick={connectInstagram} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Instagram className="w-4 h-4 mr-2" />
                Conectar Instagram
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">@{instagramAccount?.username}</h3>
                    <p className="text-sm text-gray-600">{instagramAccount?.name}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={disconnectInstagram}>
                  Desconectar
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg">{instagramAccount?.followers_count?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Seguidores</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg">{instagramAccount?.media_count}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Configurações de Auto-Post */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Divulgação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-post">Divulgação Automática</Label>
                  <p className="text-sm text-gray-600">
                    Postar automaticamente quando eventos forem criados
                  </p>
                </div>
                <Switch
                  id="auto-post"
                  checked={autoPost}
                  onCheckedChange={setAutoPost}
                />
              </div>
            </CardContent>
          </Card>

          {/* Criar Post */}
          <Card>
            <CardHeader>
              <CardTitle>Criar Post para Instagram</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compose">Compor</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="share">Compartilhar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compose" className="space-y-4">
                  <div>
                    <Label htmlFor="post-content">Conteúdo do Post</Label>
                    <Textarea
                      id="post-content"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Escreva o conteúdo do seu post..."
                      rows={8}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {postContent.length}/2200 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="media-upload">Adicionar Mídia</Label>
                    <Input
                      id="media-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="mt-1"
                    />
                  </div>

                  {selectedMedia.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedMedia.map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={`Media ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Video className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            onClick={() => removeMedia(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    onClick={postToInstagram} 
                    disabled={!postContent.trim() || isPosting}
                    className="w-full"
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Postando...
                      </>
                    ) : (
                      <>
                        <Instagram className="w-4 h-4 mr-2" />
                        Postar no Instagram
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  <div>
                    <Label htmlFor="template-select">Escolher Template</Label>
                    <Select value={postTemplate} onValueChange={setPostTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(templates).map(([key, template]) => (
                          <SelectItem key={key} value={key}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Preview:</h4>
                    <pre className="text-sm whitespace-pre-wrap">
                      {templates[postTemplate]?.content}
                    </pre>
                  </div>

                  <Button 
                    onClick={() => setPostContent(templates[postTemplate].content)}
                    className="w-full"
                  >
                    Usar Este Template
                  </Button>
                </TabsContent>

                <TabsContent value="share" className="space-y-4">
                  <div>
                    <Label>Conteúdo para Compartilhamento</Label>
                    <div className="p-4 bg-gray-50 rounded-lg mt-2">
                      <pre className="text-sm whitespace-pre-wrap">
                        {generateShareableContent()}
                      </pre>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(generateShareableContent())}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Texto
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Instagram
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Histórico de Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Divulgações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Post de divulgação</p>
                      <p className="text-sm text-gray-600">Há 2 horas • 45 curtidas</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Post
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Instagram className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Story promocional</p>
                      <p className="text-sm text-gray-600">Ontem • 120 visualizações</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Story
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal de Sucesso */}
      <Dialog open={postSuccess} onOpenChange={setPostSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <DialogTitle>Post Publicado!</DialogTitle>
                <DialogDescription>
                  Seu evento foi divulgado no Instagram com sucesso
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                O post está agora visível no seu perfil do Instagram. 
                Acompanhe o engajamento através do app do Instagram.
              </p>
            </div>
            <Button onClick={() => setPostSuccess(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InstagramIntegration

